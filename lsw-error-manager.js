globalThis.ErrorSummary = class {
  constructor(data) {
    Object.assign(this, data);
  }
  toString() {
    return JSON.stringify(this, null, 2);
  }
}

globalThis.Error = class AccumulableError extends Error {
  constructor(...args) {
    super(...args);
    this.$accumulatedErrors = [];
  }
  toString() {
    return JSON.stringify(this, null, 2);
  }
  toJSON() {
    const data = {
      name: this.name || "Error",
      message: this.message || "",
      stack: this.stack ? this.stack.split("\n    at ") : "",
      ...this,
    };
    if(this.$accumulatedErrors && this.$accumulatedErrors.length) {
      data.$accumulatedErrors = this.$accumulatedErrors;
    }
    return data;
  }
  unified() {
    this.message = this.message + "\n" + this.$accumulatedErrors.map((e,i) => (i+1) + ': ' + e.name + ': ' + e.message).join("\n");
    this.$accumulatedErrors = [];
    return this;
  }
  prependError(error) {
    this.$accumulatedErrors.unshift(error);
    return this;
  }
  appendError(error) {
    this.$accumulatedErrors.push(error);
    return this;
  }
  summarized() {
    let uniqueTraces = [];
    let commonTraces = [];
    // Recopilar las trazas de la pila de errores acumulados
    const allStacks = this.$accumulatedErrors.map(
      (error) => (error.stack ? error.stack.split("\n    at ") : [])
    );
    // Si no hay acumulados, no hay comunes ni únicos
    if (allStacks.length === 0) {
      return new ErrorSummary({
        name: this.name,
        message: this.message,
        stack: this.stack ? this.stack.split("\n    at ") : [],
        uniqueTraces: uniqueTraces,
        commonTraces: commonTraces,
      });
    }
    // Identificar trazas comunes
    const firstStack = allStacks[0];
    for (let i = 0; i < firstStack.length; i++) {
      const trace = firstStack[i];
      let isCommon = true;
      for (let j = 1; j < allStacks.length; j++) {
        if (!allStacks[j].includes(trace)) {
          isCommon = false;
          break;
        }
      }
      if (isCommon) {
        commonTraces.push(trace);
      }
    }
    // Identificar trazas únicas
    for (let i = 0; i < allStacks.length; i++) {
      const uniqueForStack = [];
      for (let j = 0; j < allStacks[i].length; j++) {
        const trace = allStacks[i][j];
        if (!commonTraces.includes(trace)) {
          uniqueForStack.push(trace);
        }
      }
      uniqueTraces.push(uniqueForStack);
    }
    return new ErrorSummary({
      ...this,
      name: this.name,
      message: this.message,
      stack: this.stack ? this.stack.split("\n    at ") : [],
      uniqueTraces: uniqueTraces,
      commonTraces: commonTraces,
    });
  }
  
}
