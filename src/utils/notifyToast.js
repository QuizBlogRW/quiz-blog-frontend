import { toast } from 'react-toastify'

export const notify = (message, status) => {
    if (status === 'error') {
        toast.error(message, { position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    }
    else {
        toast.success(message, { position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined });
    }
}