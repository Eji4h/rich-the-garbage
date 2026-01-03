import { Scene } from 'phaser';
import { ObservableScore } from './ObservableScore';
import { Score } from '../../../ports/Score.port';

export class ScoreSync {
  private pendingScore: number = 0;
  private syncTimer: Phaser.Time.TimerEvent | null = null;
  private isSyncing: boolean = false;

  constructor(
    private readonly scene: Scene,
    private readonly scorePort: Score,
    private readonly clientScore: ObservableScore,
    private readonly globalScore: ObservableScore,
  ) {}

  addPendingScore(amount: number): void {
    this.pendingScore += amount;
    this.scheduleSyncScore();
  }

  async fetchScores(): Promise<void> {
    try {
      const data = await this.scorePort.getScore();
      // Observers will be notified automatically
      this.globalScore.value = data.globalScore || 0;
      this.clientScore.value = data.clientScore || 0;
    } catch (error) {
      console.error('Failed to fetch scores:', error);
    }
  }

  private scheduleSyncScore(): void {
    if (this.syncTimer) {
      this.syncTimer.destroy();
    }

    this.syncTimer = this.scene.time.delayedCall(300, () => {
      this.syncScore();
    });
  }

  private async syncScore(): Promise<void> {
    if (this.shouldSkipSync()) {
      return;
    }

    const scoreToSync = this.capturePendingScore();
    this.isSyncing = true;

    try {
      const serverResponse = await this.scorePort.addScore(scoreToSync);
      this.updateScoresFromServerResponse(serverResponse);
    } catch (error) {
      console.error('Failed to sync score:', error);
      // Restore pending score on error so we can retry
      this.pendingScore += scoreToSync;
    } finally {
      this.isSyncing = false;
      this.scheduleNextSyncIfNeeded();
    }
  }

  private shouldSkipSync(): boolean {
    return this.isSyncing || this.pendingScore === 0;
  }

  private capturePendingScore(): number {
    const scoreToSync = this.pendingScore;
    this.pendingScore = 0;
    return scoreToSync;
  }

  private updateScoresFromServerResponse(serverResponse: {
    globalScore?: number;
    clientScore?: number;
  }): void {
    const serverGlobalScore = serverResponse.globalScore || 0;
    const serverClientScore = serverResponse.clientScore || 0;

    // Server values already include the synced score.
    // Add any new pending scores that accumulated during the async sync operation.
    const newPendingScore = this.pendingScore;

    // Observers will be notified automatically
    this.globalScore.value = serverGlobalScore + newPendingScore;
    this.clientScore.value = serverClientScore + newPendingScore;
  }

  private scheduleNextSyncIfNeeded(): void {
    if (this.pendingScore > 0) {
      this.scheduleSyncScore();
    }
  }
}
