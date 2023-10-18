import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const goToRegistration = () => {
        navigate("/registration");
    }
    return (
        <div>
            <div className="d-flex justify-content-center my-5">
                <h1>Welcome to SongSnap</h1>
            </div>
            <div className="row">
                <div className="col-md-3 d-none d-md-block"></div>
                <div className="col-md-6 col-12">
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                            <form>
                                <div className="text-center mb-3">
                                    <h4>Please Sign In</h4>
                                    <div className="form-outline mb-4">
                                        <div className="d-flex justify-content-start">
                                            <label className="form-label" htmlFor="username">Username</label>
                                        </div>
                                        <input name="username" type="text" id="username" className="form-control" />
                                    </div>

                                    <div className="form-outline mb-4">
                                        <div className="d-flex justify-content-start">
                                            <label className="form-label" htmlFor="password">Password</label>
                                        </div>
                                        <input name="password" type="password" id="password" className="form-control" />
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center">
                                        <button type="submit" className="btn btn-outline-primary btn-block mb-4">Sign in</button>
                                    </div>

                                    <div className="text-center">
                                        <p>Not a member? <a className="btn btn-outline-primary" onClick={goToRegistration}>Register</a></p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
