const url = "http://localhost:4000";

const passwordReset = (name, email, token) => {
    return `<div>
        <main>
            <div>
                <h3>
                    Hello, ${name}, your email id is ${email}
                </h3>
                <p>
                    Follow this link to reset your password..
                </p>
                <p>
                    <strong>
                        <a class="btn btn-outline-info" target="_blank" href="${url}/password/reset?token=${token}">
                            Reset Password
                        </a>
                    </strong>
                </p>
                <p>
                    If you didn't ask to reset your password, ignore this link.
                </p>
                <h4>
                    Thanks
                </h4>
                <h6>
                    Team API.
                </h6>
            </div>
        </main>
    </div>`
}

module.exports = passwordReset