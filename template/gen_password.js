const url = "http://localhost:3000";

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
                        ${token}
                    </strong>
                </p>
                <p>
                    If you didn't ask to reset your password, ignore this link.
                </p>
                <h4>
                    Thanks
                </h4>
                <h6>
                    Team NetCrakers.
                </h6>
            </div>
        </main>
    </div>`
}

module.exports = passwordReset