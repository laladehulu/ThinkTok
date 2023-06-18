import "./Header.css"

export default function Header(){

    return <>
        <a type="button" onClick={event => {window.location.href='/'}}>
            <div className="w-100 p-3">
                <div className="w-100 d-flex flex-row justify-content-center logoButton">
                    <img src="Thinktok_favicon.png" className="rounded invert" style={{width: 40}} />
                </div>
            </div>
        </a>
    </>
}