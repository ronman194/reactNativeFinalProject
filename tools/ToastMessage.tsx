import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import Colors from './Colors';

export const showSuccessToast = (message: string) => {
    Toast.show({
        type: 'success',
        text2: message
    });
}
export const showErrorToast = (message: string) => {
    Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message
    });
}

export const toastConfig = {
    success: (props:any) => (
        <BaseToast
        {...props}
        style={{ borderLeftColor:Colors.background,backgroundColor: Colors.blue }}
        text1Style={{
            fontSize: 17
        }}
        text2Style={{
            fontSize: 15,
            color: Colors.background
        }}
        />
    ),

    error: (props:any) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor:Colors.background,backgroundColor: Colors.delete }}
            text1Style={{
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: Colors.background
            }}
        />
    ),

};
