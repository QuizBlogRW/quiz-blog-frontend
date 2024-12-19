import React, { useState, useEffect } from 'react'
import { Row, TabPane } from 'reactstrap'
import SearchInput from '../../utils/SearchInput'
import { getUsers } from '../../redux/slices/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import UserToast from './UserToast'
import QBLoadingSM from '../rLoading/QBLoadingSM'

const UsersTabPane = () => {

    // Redux
    const auth = useSelector(state => state.auth)
    const { users, isLoading } = auth
    const dispatch = useDispatch()

    // Lifecycle methods
    useEffect(() => { dispatch(getUsers()) }, [dispatch])

    const adminsCreators = users && users.filter(user => user.role === "SuperAdmin" || user.role === "Admin" || user.role === "Creator")
    const [searchKey, setSearchKey] = useState('')

    return (

        <TabPane tabId="8">
            {
                isLoading ?
                    <QBLoadingSM title='users' /> :

                    <>
                        <SearchInput setSearchKey={setSearchKey} placeholder={` Search here any user from ${users.length} available users...  `} />

                        {searchKey === "" ? null :
                            <Row>
                                {users && users
                                    .map(user => (
                                        user.name.toLowerCase().includes(searchKey.toLowerCase()) ?
                                            <UserToast key={user._id} user={user} fromSearch={true} />
                                            : null
                                    ))}
                            </Row>}

                        <p className="text-center my-3 fw-bolder text-underline">
                            <u>Admin and Creators</u>
                        </p>
                        <Row>
                            {adminsCreators && adminsCreators.map(aCreator => (
                                <UserToast key={aCreator._id} user={aCreator} />
                            ))}
                        </Row>

                        <p className="text-center my-3 fw-bolder text-underline">
                            <u>8 Newest Users</u>
                        </p>
                        <Row>
                            {users && users.map(newUser => (
                                <UserToast key={newUser._id} user={newUser} />
                            )).slice(0, 8)}
                        </Row>
                    </>
            }

        </TabPane>
    )
}

export default UsersTabPane