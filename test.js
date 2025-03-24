require(__dirname + "/lsw-error-manager.js");

describe("LSW Error Manager API Test", function (it) {

  it("can create an instance", async function () {

    try {
      try {
        try {
          try {
            throw new Error("OriginalError");
          } catch (error) {
            throw error.appendError(new Error("Phase 1.1.1 broken"));
          }
        } catch (error) {
          throw error.appendError(new Error("Phase 1.1 broken"));
        }
      } catch (error) {
        throw error.appendError(new Error("Phase 1 broken"));
      }
    } catch (error) {
      console.log(`Phase 1 aborted due to: ${error}`);
      console.log(`Phase 1 aborted due to: ${error.summarized()}`);
    }

  });

  it("can still debug extended errors", async function () {

    try {
      const err = new Error("");
      err.otherProperty = 500;
      throw err;
    } catch (error) {
      console.log(`Can see the error extended property: ${error}`);
    }

  });

});