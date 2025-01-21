import './Footer.css'

function Footer() {
    return (
        <div className='footer'>
            <div className='first-column-footer'>
                <img src="/images/gato.jpg" alt="Kazoku" />
            </div>

            <div className='second-column-footer'>
                <h3>KAZOKU</h3>
                <p>About us</p>
                <p>Join the Community</p>
                <p>Values: Collaboration, Inclusion & Growth</p>
            </div>

            <div className='third-column-footer'>
                <h3>The Team</h3>
                <p><a href="https://github.com/EkaitzGA" target="_blank" rel="noopener noreferrer">Ekaitz Guerra</a></p>
<p><a href="https://github.com/Izorrai" target="_blank" rel="noopener noreferrer">Jon Latxiondo</a></p>
<p><a href="https://github.com/saulm96" target="_blank" rel="noopener noreferrer">Saul Mora</a></p>
<p><a href="https://github.com/inesuribeb" target="_blank" rel="noopener noreferrer">Ines Uribe</a></p>
            </div>

            <div className='fourth-column-footer'>
                <h3>Explore</h3>
                <p>Web Projects</p>
                <p>Users</p>
                <p>Contact</p>
            </div>

            <div className='all-rights'>
                <p>© KAZOKU 2025- All rights reserved</p>
            </div>
        </div>
    )
}

export default Footer;