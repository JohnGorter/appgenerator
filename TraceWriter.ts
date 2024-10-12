export class TraceWriter {
  area:any
  category:any
  mode:any

  static ENABLED = 1;
  static DISABLED = 2;
  
  static AREA_TREEBUILDING = 1;
  static AREA_PREPARSING = 2;
  static AREA_CODEGENERATION = 4;
  static AREA_COMPILATIOM = 8;
  static AREA_RUNNING = 16;
  static AREA_GENERAL = 32;
  static AREA_ALL = 255;
  
  static VERBOSE = 50;
  static INFO = 10;
  static WARNING = 5;
  static ERROR = 1;

    constructor(mode:any, category:any, area:any) {
      this.area = area;
      this.category = category;
  
      if (!mode) this.mode = TraceWriter.DISABLED;
      else this.mode = mode;
  
      if (this.mode == TraceWriter.ENABLED) process.stderr.write("\x1B[?25l");
      this.trace("Starting the trace...");
    }
    
    areaToName(area:any) {
     return ["TREEBUILDING","PREPARSING","CODEGENERATION","COMPILATION","RUNNING","GENERAL"][([1,2,4,8,16,32].indexOf(area))]
    }
  
    areaToColor(area:any) {
      switch (area){
        case 1: return 35
        case 2: return 36
        case 4: return 32
        case 8: return 34
        case 16: return 32
        case 32: return 34
      }
    }
  
    trace(line:any, category = TraceWriter.INFO, area = TraceWriter.AREA_GENERAL) {
      if (this.mode == TraceWriter.ENABLED) {
        if (category <= this.category) {
          if (area & this.area || category == TraceWriter.ERROR) {
            switch (category) {
              case TraceWriter.ERROR: {
                console.log(
                  `\x1b[31m\x1b[1m ◉  TRACE ${this.areaToName(area)}: !!ERROR!! ${line.toUpperCase()}\x1b[0m`
                );
                break;
              }
              case TraceWriter.WARNING: {
                console.log(
                  `\x1b[33m\x1b[1m ◉  TRACE ${this.areaToName(area)}: !WARNING! ${line.toUpperCase()}\x1b[0m`
                );
                break;
              }
              case TraceWriter.INFO: {
                console.log(
                  `\x1b[${this.areaToColor(area)}m\x1b[1m ◉  TRACE ${this.areaToName(area)}: ${line.toUpperCase()}\x1b[0m`
                );
                break;
              }
              case TraceWriter.VERBOSE: {
                console.log(
                  `\x1b[${this.areaToColor(area)}m\x1b[1m ◉  TRACE ${this.areaToName(area)}: ${line.toUpperCase()}\x1b[0m`
                );
                break;
              }
            }
          }
        }
      }
    }
    warn (line:any, area:any) { this.trace(line, TraceWriter.WARNING, area) }
    error (line:any, area:any) { this.trace(line, TraceWriter.ERROR, area) }
    info (line:any, area:any) { this.trace(line, TraceWriter.INFO, area) }
    verbose (line:any, area:any) { this.trace(line, TraceWriter.VERBOSE, area) }
  }
  
  
  
  let mode = TraceWriter.DISABLED;
  let category = TraceWriter.INFO;
  let area = 0;
  
  var myArgs = process.argv.slice(2);
  if (myArgs.find((i) => i == "--info")) {
    mode = TraceWriter.ENABLED;
    category = TraceWriter.INFO;
  }
  
  if (myArgs.find((i) => i == "--error")) {
    mode = TraceWriter.ENABLED;
    category = TraceWriter.ERROR;
  }
  
  if (myArgs.find((i) => i == "--warning")) {
    mode = TraceWriter.ENABLED;
    category = TraceWriter.WARNING;
  }
  
  if (myArgs.find((i) => i == "--verbose")) {
    mode = TraceWriter.ENABLED;
    category = TraceWriter.VERBOSE;
  }
  
  if (myArgs.find((i) => i == "--treebuilding")) {
    mode = TraceWriter.ENABLED;
    area = area | TraceWriter.AREA_TREEBUILDING;
  }
  if (myArgs.find((i) => i == "--preparsing")) {
    mode = TraceWriter.ENABLED;
    area = area | TraceWriter.AREA_PREPARSING;
  }
  if (myArgs.find((i) => i == "--codegeneration")) {
    mode = TraceWriter.ENABLED;
    area = area | TraceWriter.AREA_CODEGENERATION;
  }
  if (myArgs.find((i) => i == "--compilation")) {
    mode = TraceWriter.ENABLED;
    area = area | TraceWriter.AREA_COMPILATIOM;
  }
  if (myArgs.find((i) => i == "--running")) {
    mode = TraceWriter.ENABLED;
    area = area | TraceWriter.AREA_RUNNING;
  }
  if (myArgs.find((i) => i == "--all")) {
    mode = TraceWriter.ENABLED;
    area = area | TraceWriter.AREA_ALL;
  }
  area = area || 255;
  var tracer:any = tracer || new TraceWriter(mode, category, area);
  
  export const traceWriter = tracer