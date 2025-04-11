import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {Button} from "react-bootstrap";

function LoginForm() {
    return (
        <>
            <h1>Login</h1> {/* Need to add className to make this centered */}
            <FloatingLabel
                controlId="floatingInput"
                label="Email address"
                className="mb-3"
            >
                <Form.Control type="email" placeholder="name@example.com" />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control type="password" placeholder="Password" />
            </FloatingLabel>
            <br/>
            <Button type="submit">Login</Button> {/* We need to make the button actually work */}
        </>
    );
}

export default LoginForm;