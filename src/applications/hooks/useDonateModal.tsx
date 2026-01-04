import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  lazy,
  Suspense,
} from 'react';

const DonateModalLazy = lazy(() => import('../components/DonateModal'));

interface DonateModalContextType {
  isOpen: boolean;
  openDonateModal: () => void;
  closeDonateModal: () => void;
  prefetchModal: () => void;
}

const DonateModalContext = createContext<DonateModalContextType | undefined>(
  undefined,
);

export function DonateModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false); // Track if modal has been opened to avoid hydration mismatch

  const openDonateModal = useCallback(() => {
    setIsOpen(true);
    setHasBeenOpened(true);
  }, []);

  const closeDonateModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const prefetchModal = useCallback(() => {
    // Prefetch the modal chunk (code-split) without opening it.
    if (typeof window !== 'undefined') {
      import('../components/DonateModal');
    }
  }, []);

  useEffect(() => {
    // Prefetch + mount the modal chunk after initial render so first open is fast,
    // without waiting for hover/focus/click.
    if (typeof window === 'undefined') return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void import('../components/DonateModal')
        .catch(() => null)
        .finally(() => {
          if (!cancelled) {
            setHasBeenOpened(true);
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <DonateModalContext.Provider
      value={{ isOpen, openDonateModal, closeDonateModal, prefetchModal }}
    >
      {children}
      {hasBeenOpened && (
        <Suspense fallback={null}>
          <DonateModalLazy />
        </Suspense>
      )}
    </DonateModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDonateModal() {
  const context = useContext(DonateModalContext);
  if (context === undefined) {
    throw new Error('useDonateModal must be used within a DonateModalProvider');
  }
  return context;
}
