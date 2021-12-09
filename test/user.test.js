const User = require('../models/user.js');

jest.setTimeout(20000);

test('findAndValidate to be truthy', async ()=> {
    // const valid = await User.findAndValidate("test@test.com", "Test1234");
    // expect(valid).toBeFalsy();
    expect(User.findAndValidate("test@test.com", "Test1234")).toBeTruthy();
});
