// globals.d.ts
declare var define: {
  (deps: string[], factory: (...args: any[]) => any): void;
  (factory: (...args: any[]) => any): void;
  (name: string, deps: string[], factory: (...args: any[]) => any): void;
  amd: object;
};

declare var requirejs: any;
declare var require: any;
