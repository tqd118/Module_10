"use client";

export default function GlobalError() {
    return (
        <div className="app-fallback-page app-fallback-page--error">
            <i className="icon-error app-fallback-page__icon" />
            <h2 className="app-fallback-page__title">
                Oops...
                <br />
                Something bad has just happened
            </h2>
        </div>
    );
}