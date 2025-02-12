class Logger {
  static logStyles = {
    info: {
      ascii: "🔵 ℹ️",
      color: "\x1b[36m", // cyan
    },
    error: {
      ascii: "🔴 ❌",
      color: "\x1b[31m", // red
    },
    debug: {
      ascii: "🟡 🔍",
      color: "\x1b[33m", // yellow
    },
    api: {
      ascii: "🟣 🌐",
      color: "\x1b[35m", // magenta
    },
    plex: {
      ascii: "🟢 📺",
      color: "\x1b[32m", // green
    },
  };

  static formatMessage(type, message, data = null) {
    const timestamp = new Date().toISOString();
    const style = this.logStyles[type];
    const dataString = data ? JSON.stringify(data, null, 2) : "";
    return `${
      style.ascii
    } [${type.toUpperCase()}] ${timestamp} - ${message} ${dataString}`;
  }

  static info(message, data = null) {
    console.log(this.formatMessage("info", message, data));
  }

  static error(message, error = null) {
    console.error(this.formatMessage("error", message, error));
  }

  static debug(message, data = null) {
    console.debug(this.formatMessage("debug", message, data));
  }

  static api(message, data = null) {
    console.log(this.formatMessage("api", message, data));
  }

  static plex(message, data = null) {
    console.log(this.formatMessage("plex", message, data));
  }
}

export default Logger;
