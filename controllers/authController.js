let users = [{ username: 'admin', password: 'admin' }];

exports.login = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.send({ success: true });
    } else {
        res.send({ success: false });
    }
};
