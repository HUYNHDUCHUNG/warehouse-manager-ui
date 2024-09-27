import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { ReactNode } from 'react'

interface AlertDialogComponentProps {
  title: string
  description: string
  triggerText: string
  actionText: string
  cancelText: string
  onConfirm: () => void
  triggerElement?: ReactNode // Tùy chọn để truyền phần tử tùy chỉnh cho nút kích hoạt
}

const AlertDialogComponent = ({
  title,
  description,
  triggerText,
  actionText,
  cancelText,
  onConfirm,
  triggerElement
}: AlertDialogComponentProps) => {
  return (
    <div>
      <AlertDialog>
        {/* Sử dụng phần tử kích hoạt tùy chỉnh nếu có, không thì dùng nút mặc định */}
        <AlertDialogTrigger asChild>
          {triggerElement ? triggerElement : <button>{triggerText}</button>}
        </AlertDialogTrigger>
        <AlertDialogContent className='alert-dialog-content bg-white shadow-lg rounded-lg'>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancelText}</AlertDialogCancel>
            <AlertDialogAction className='bg-red-600' onClick={onConfirm}>
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AlertDialogComponent
