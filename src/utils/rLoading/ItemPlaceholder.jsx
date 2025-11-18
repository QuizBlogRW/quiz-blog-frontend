import { Card } from 'reactstrap';
import './ItemPlaceholder.css';

const ItemPlaceholder = () => {

    return (
        <Card body className="placeholder-item bg-light py-3 px-1 px-sm-3 my-2 my-sm-3 border">
            <div className="skeleton-container">
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
            </div>
        </Card>
    );
};
export default ItemPlaceholder;
