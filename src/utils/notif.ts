import { Store } from 'react-notifications-component';

class notif {
  static success = (msg: string) => {
    Store.addNotification({
      title: "Successful!",
      message: msg,
      type: "success",
      insert: "top",
      container: "top-center",
      animationIn: ["animate__animated", "animate__bounceIn"],
      animationOut: ["animate__animated", "animate__bounceOut"],
      dismiss: {
        duration: 3500,
        onScreen: false,
        pauseOnHover: true,
        showIcon: true,

      },
    });
  };

  static error = (msg: string) => {
    Store.addNotification({
      title: "Error!",
      message: msg,
      type: "danger",
      insert: "top",
      container: "top-center",
      animationIn: ["animate__animated", "animate__bounceIn"],
      animationOut: ["animate__animated", "animate__bounceOut"],
      dismiss: {
        duration: 3500,
        onScreen: false,
        pauseOnHover: true,
        showIcon: true,

      },
    });
  };

  static info = (msg: string) => {
    Store.addNotification({
      title: "Info!",
      message: msg,
      type: "info",
      insert: "top",
      container: "top-center",
      animationIn: ["animate__animated", "animate__bounceIn"],
      animationOut: ["animate__animated", "animate__bounceOut"],
      dismiss: {
        duration: 3500,
        onScreen: false,
        pauseOnHover: true,
        showIcon: true,

      },
    });
  };

  static warning = (msg: string) => {
    Store.addNotification({
      title: "Warning!",
      message: msg,
      type: "warning",
      insert: "top",
      container: "top-center",
      animationIn: ["animate__animated", "animate__bounceIn"],
      animationOut: ["animate__animated", "animate__bounceOut"],
      dismiss: {
        duration: 3500,
        onScreen: false,
        pauseOnHover: true,
        showIcon: true,

      },
    });
  };
}

export default notif;