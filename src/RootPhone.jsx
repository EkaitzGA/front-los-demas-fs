import PhoneComponent from './components/phoneComponent/PhoneComponent';
import './RootPhone.css'

function RootPhone() {
    return (
        <div className="root-phone__content">
            <main className='mobile-main'>
            <PhoneComponent />
            </main>
        </div>
    )
}

export default RootPhone;