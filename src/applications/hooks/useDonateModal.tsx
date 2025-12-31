import {
  createContext,
  useContext,
  useState,
  useCallback,
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
    // Prefetch the modal chunk on hover/focus
    if (typeof window !== 'undefined') {
      import('../components/DonateModal');
    }
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

export function useDonateModal() {
  const context = useContext(DonateModalContext);
  if (context === undefined) {
    throw new Error('useDonateModal must be used within a DonateModalProvider');
  }
  return context;
}
