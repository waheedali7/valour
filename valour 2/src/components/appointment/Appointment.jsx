'use client';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AppointmentModal from './AppointmentModal';

const AppointmentContext = createContext({ open: () => {} });

/** Hosts the single Book an Appointment modal; any call to action can open it with useAppointment(). */
export function AppointmentProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, service: '', trigger: null });

  // `service` preselects the Service Type field, e.g. 'Routine Service' from the servicing page.
  const open = useCallback((service = '') => {
    setState({ isOpen: true, service, trigger: document.activeElement });
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, isOpen: false })), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <AppointmentContext.Provider value={value}>
      {children}
      <AppointmentModal isOpen={state.isOpen} service={state.service} trigger={state.trigger} onClose={close} />
    </AppointmentContext.Provider>
  );
}

export const useAppointment = () => useContext(AppointmentContext);

/** A button that opens the appointment modal. */
export function BookButton({ service, className = 'btn', children = 'Book an Appointment', onClick, ...props }) {
  const { open } = useAppointment();
  return (
    <button type="button" className={className} {...props}
      onClick={(e) => { onClick?.(e); open(service); }}>
      {children}
    </button>
  );
}
