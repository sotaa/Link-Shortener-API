import { ConsoleColors } from "./console-colors-code";

class SystemConsoleColors {
  success: string;
  error: string;
  warning: string;
  info: string;
  blink: string;
  bright: string;

  constructor(conf) {
    this.success = this.consoleColorFormater(conf.FgGreen);
    this.error = this.consoleColorFormater(conf.FgRed);
    this.warning = this.consoleColorFormater(conf.BgYellow);
    this.info = this.consoleColorFormater(conf.BgCyan);
    this.blink = this.consoleColorFormater(conf.Blink);
    this.bright = this.consoleColorFormater(conf.Bright);
  }

  private consoleColorFormater(str: string) {
    return str.concat("%s", ConsoleColors.Reset);
  }
}

export default new SystemConsoleColors(ConsoleColors);
