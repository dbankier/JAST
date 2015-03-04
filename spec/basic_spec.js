describe("Index Tests", function() {
  it("must have a white background",function() {
    var index = Alloy.createController("index");
    expect(index.getView().backgroundColor).toBe("white");
  });
});
