import React, { useState, useEffect } from 'react'
import { Row, TabPane } from 'reactstrap';
import { getDownloads, getCreatorDownloads, getUserDownloads, deleteDownload } from '../../redux/downloads/downloads.actions'
import { connect } from 'react-redux'
import Pagination from './Pagination';
import PageOf from './PageOf';
import DownloadsTable from './DownloadsTable';
import SpinningBubbles from '../rLoading/SpinningBubbles';

const DownloadsTabPane = ({ currentUser, downloads, getDownloads, getCreatorDownloads, getUserDownloads, deleteDownload }) => {

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
            getDownloads(pageNo)
            setNumberOfPages(totPages)
        }
        else if (uRole === 'Creator') {
            getCreatorDownloads(uId)
        }
        else {
            getUserDownloads(uId)
        }
    }, [getDownloads, getCreatorDownloads, getUserDownloads, pageNo, uId, totPages, uRole])

    return (
        <TabPane tabId="4">

            {downloads.isLoading ?
                <SpinningBubbles title='downloads' /> :

                <Row>
                    {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                        <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                    <DownloadsTable
                        downloadsToUse={downloadsToUse}
                        deleteDownload={deleteDownload}
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

const mapStateToProps = state => ({
    downloads: state.downloadsReducer
})

export default connect(mapStateToProps, { getDownloads, getCreatorDownloads, getUserDownloads, deleteDownload })(DownloadsTabPane)