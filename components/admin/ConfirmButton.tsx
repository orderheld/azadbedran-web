'use client'

type Props = { children: React.ReactNode; message: string; className?: string; disabled?: boolean; formAction?: (f: FormData) => void | Promise<void> }

export default function ConfirmButton({ children, message, className = 'btn btn-danger', disabled, formAction }: Props) {
  return (
    <button type="submit" className={className} disabled={disabled} formAction={formAction} formNoValidate onClick={(e) => { if (!window.confirm(message)) e.preventDefault() }}>
      {children}
    </button>
  )
}
