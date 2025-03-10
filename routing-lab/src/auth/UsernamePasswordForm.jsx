import { useActionState } from "react";

export function UsernamePasswordForm(props) {
    const [result, sumbitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const username = formData.get("username");
            const password = formData.get("password");

            if (!username || !password) {
                return {
                    type: "error",
                    message: "Please fill in username and password",
                };
            }

            return await props.onSubmit({ username, password }); 

        },
        null
    );


    return (
        <>
        <form action={sumbitAction}>
            <div>
                <label htmlFor="username">
                    <p>Username</p>
                    <input name="username" id="username" disabled={isPending}></input>
                </label>
            </div>
            <div>
                <label htmlFor="password">
                    <p>Password</p>
                    <input name="password" id="password" disabled={isPending}></input>
                </label>
            </div>
            <input type="submit" value="Submit" disabled={isPending}/>
        </form>
        {result && <p className={`message ${result.type}`}>{result.message}</p>}
        {isPending && <p className="message loading">Loading ...</p>}
        </>
    );
}