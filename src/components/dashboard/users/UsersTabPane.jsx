import { useState, useEffect } from 'react'
import { Row, TabPane } from 'reactstrap'
import SearchInput from '@/utils/SearchInput'
import { getUsers, getLatestUsers, getAdminsCreators } from '@/redux/slices/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import UserToast from './UserToast'
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM'

const UsersTabPane = () => {

    // Redux
    const { users, isLoadingUsers, isLoadingLatestUsers, isLoadingAdminsCreators, latestUsers, adminsCreators } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    // Lifecycle methods
    useEffect(() => {
        dispatch(getLatestUsers())
        dispatch(getAdminsCreators())
        dispatch(getUsers())
    }, [dispatch])

    const [searchKey, setSearchKey] = useState('')

    const renderUsers = (usersList, fromSearch = false) => (
        <Row>
            {usersList.map(user => (
                <UserToast key={user._id} userToUse={user} fromSearch={fromSearch} />
            ))}
        </Row>
    );

    return (

        <TabPane tabId="8">
            {
            <>
                    <p className='m-3 w-100'>
                        To see more about subscribers, click here 👉<button className="btn btn-sm btn-outline-warning ms-2">
                            <a href={'/subscribers'} style={{ color: 'var(--brand)', fontWeight: 'bolder' }}>Subscribers</a>
                        </button>
                    </p>
                    {
                        isLoadingUsers ?
                            <QBLoadingSM title='users' /> :
                            <SearchInput setSearchKey={setSearchKey} placeholder={` Search here any user from ${users.length} available users...  `} />
                    }

                    {searchKey === "" ? null : renderUsers(users.filter(user => user.name.toLowerCase().includes(searchKey.toLowerCase())), true)}
                    <p className="text-center my-3 fw-bolder text-underline">
                        <u>Admin and Creators</u>
                    </p>
                    {isLoadingAdminsCreators ? <QBLoadingSM title='admins and creators' /> : renderUsers(adminsCreators)}

                    <p className="text-center my-3 fw-bolder text-underline">
                        <u>8 Newest Users</u>
                    </p>
                    {isLoadingLatestUsers ? <QBLoadingSM title='latest users' /> : renderUsers(latestUsers)}
                </>
            }

        </TabPane>
    )
}

export default UsersTabPane