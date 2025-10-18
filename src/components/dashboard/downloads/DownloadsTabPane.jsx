import { useState, useEffect } from 'react'
import { Row, TabPane } from 'reactstrap';
import { getDownloads, getCreatorDownloads, getNotesDownloader } from '@/redux/slices/downloadsSlice'
import { useSelector, useDispatch } from 'react-redux'
import Pagination from '@/components/dashboard/utils/Pagination';
import PageOf from '@/components/dashboard/utils/PageOf';
import DownloadsTable from './DownloadsTable';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

const DownloadsTabPane = () => {

    // Redux
    const dispatch = useDispatch()
    const downloads = useSelector(state => state.downloads)
    const { isLoading, totalPages, allDownloads, userDownloads, creatorDownloads } = downloads

    const { user } = useSelector(state => state.auth)
    const downloadsToUse = downloads && (user?.role === 'Admin' || user?.role === 'SuperAdmin') ? allDownloads :
        downloads && (user?.role === 'Creator') ? creatorDownloads : userDownloads

    const [pageNo, setPageNo] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0)

    // Lifecycle methods
    useEffect(() => {
        if (user?.role === 'Admin' || user?.role === 'SuperAdmin') {
            dispatch(getDownloads(pageNo))
            setNumberOfPages(totalPages && totalPages)
        }
        else if (user?.role === 'Creator') {
            dispatch(getCreatorDownloads(user?._id, pageNo))
        }
        else {
            dispatch(getNotesDownloader(user?._id, pageNo))
        }
    }, [dispatch, pageNo, user, totalPages])

    return (
        <TabPane tabId="5">

            {isLoading ?
                <QBLoadingSM title='downloads' /> :

                <Row>
                    {(user?.role === 'Admin' || user?.role === 'SuperAdmin') ?
                        <PageOf pageNo={pageNo} numberOfPages={numberOfPages} /> : null}

                    <DownloadsTable
                        downloadsToUse={downloadsToUse}
                        pageNo={pageNo} />

                    {user?.role !== 'Visitor' ?
                        <>
                            <Pagination pageNo={pageNo} setPageNo={setPageNo} numberOfPages={numberOfPages} />
                        </> : null}
                </Row>
            }

        </TabPane>
    )
}

export default DownloadsTabPane
