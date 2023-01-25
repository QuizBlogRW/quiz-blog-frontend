import React, { useState, useEffect } from 'react'
import { Row, TabPane } from 'reactstrap'
import { connect } from 'react-redux'
import SearchInput from '../SearchInput'
import { getUsers, deleteUser } from '../../redux/auth/auth.actions'
import UserToast from './UserToast'
import SpinningBubbles from '../rLoading/SpinningBubbles'

const UsersTabPane = ({ users, getUsers, deleteUser }) => {

    // Lifecycle methods
    useEffect(() => {
        getUsers()
    }, [getUsers])

    const adminsCreators = users && users.users.filter(user => user.role === "SuperAdmin" || user.role === "Admin" || user.role === "Creator")

    const [searchKey, setSearchKey] = useState('')

    return (

        <TabPane tabId="6">
            {
                users.isLoading ?
                    <SpinningBubbles title='users' /> :

                    <>
                        <SearchInput setSearchKey={setSearchKey} placeholder={` Search here any user from ${users.users.length} available users...  `} />

                        {searchKey === "" ? null :
                            <Row>
                                {users && users.users
                                    .map(user => (

                                        user.name.toLowerCase().includes(searchKey.toLowerCase()) ?

                                            <UserToast key={user._id} user={user} deleteUser={deleteUser} fromSearch={true} />
                                            : null
                                    ))}
                            </Row>}

                        <p className="text-center my-3 font-weight-bolder text-underline">
                            <u>Admin and Creators</u>
                        </p>
                        <Row>
                            {adminsCreators && adminsCreators.map(aCreator => (
                                <UserToast key={aCreator._id} user={aCreator} deleteUser={deleteUser} />
                            ))}
                        </Row>

                        <p className="text-center my-3 font-weight-bolder text-underline">
                            <u>8 Newest Users</u>
                        </p>
                        <Row>

                            {users && users.users.map(newUser => (
                                <UserToast key={newUser._id} user={newUser} deleteUser={deleteUser} />
                            )).slice(0, 8)}
                        </Row>
                    </>
            }

        </TabPane>
    )
}

const mapStateToProps = state => ({
    users: state.authReducer
})

export default connect(mapStateToProps, { getUsers, deleteUser })(UsersTabPane)