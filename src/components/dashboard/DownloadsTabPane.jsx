import React, { useState, useEffect, useContext } from 'react'
import { Row, TabPane } from 'reactstrap';
import { getDownloads, getCreatorDownloads, getUserDownloads } from '../../redux/slices/downloadsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Pagination from './Pagination';
import PageOf from './PageOf';
import DownloadsTable from './DownloadsTable';
import QBLoadingSM from '../rLoading/QBLoadingSM';
import { currentUserContext } from '../../appContexts'

const DownloadsTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const downloads = useSelector(state => state.downloads)

    // context
    const currentUser = useContext(currentUserContext)

    const uId = currentUser && currentUser._id
    const uRole = currentUser && currentUser.role
    const totPages = downloads && downloads.totalPages
    const downloadsToUse = downloads && (uRole === 'Admin' || uRole === 'SuperAdmin') ? downloads.allDownloads :
        downloads && (uRole === 'Creator') ? downloads.creatorDownloads : downloads.userDownloads

    const [pageNo, setPageNo] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0)

    // Lifecycle methods
    useEffect(() => {
        if (uRole === 'Admin' || uRole === 'SuperAdmin') {
            dispatch(getDownloads(pageNo))
            setNumberOfPages(totPages)
        }
        else if (uRole === 'Creator') {
            dispatch(getCreatorDownloads(uId, pageNo))
        }
        else {
            dispatch(getUserDownloads(uId, pageNo))
        }
    }, [dispatch, uRole, uId, pageNo, totPages])

    return (
        <TabPane tabId="4">

            {downloads.isLoading ?
                <QBLoadingSM title='downloads' /> :

                <Row>
                    {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                        <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                    <DownloadsTable
                        downloadsToUse={downloadsToUse}
                        currentUser={currentUser}
                        pageNo={pageNo} />

                    {uRole !== 'Visitor' ?
                        <>
                            <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                        </> : null}
                </Row>
            }

        </TabPane>
    )
}

export default DownloadsTabPane