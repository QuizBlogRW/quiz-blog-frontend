import { useSelector } from "react-redux"
import { Alert } from 'reactstrap'
import dashimg from '@/images/dashboard.svg'

const TopRow = () => {

  const { user } = useSelector(state => state.auth)

  return (

    <div className="mx-1 m-lg-4 px-lg-5 d-flex justify-content-around align-items-center text-primary">
      <div className='text-center m-2 m-sm-0'>
  <Alert style={{ background: 'var(--accent)', color: 'var(--brand)', border: '2px solid var(--brand)' }}>
          <h4 className="alert-heading">
            <strong>
              {user && user?.name?.toLowerCase().charAt(0).toUpperCase() + user?.name?.slice(1)}
            </strong>
          </h4>
          <p>
            <strong>Welcome to the {user && user.role} dashboard page</strong>
          </p>
          <hr />
          {user.role !== 'Visitor' ?
            <p className="mb-0">
              Here you can add, edit and remove features, cheers!!
            </p> :
            <p className="mb-0" style={{ fontSize: '.9rem', color: '#FFF' }}>
              Here you can view your scores, downloads and contacts, cheers!!
            </p>
          }
        </Alert>
      </div>

        <div className="dashboard-img d-none d-sm-inline w-auto">
          <img src={dashimg} alt="dashimg" onClick={
            () => {
              window.location.href = '/contact-chat'
            }
          } style={{ cursor: 'pointer', maxHeight: '200px' }} className='shadow-sm animated infinite pulse blink_me' />
        </div>
    </div>
  )
}

export default TopRow