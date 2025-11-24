import searchImg from '@/images/loupe.svg';

const SearchInput = ({ setSearchKey, placeholder }) => {
    return (
        <form className="mb-4">
            <div className="input-group mx-auto mt-2 mt-lg-4 w-100 w-md-75 shadow-sm">
                <input
                    type="text"
                    className="form-control border-2 border-success rounded-start"
                    placeholder={placeholder}
                    aria-label="Search"
                    onChange={e => setSearchKey(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn btn-success rounded-end d-flex align-items-center justify-content-center"
                    style={{ padding: '0.35rem 0.6rem' }}
                >
                    <img src={searchImg} alt="Quiz-Blog Search" width="20" height="20" />
                </button>
            </div>
        </form>
    );
};

export default SearchInput;
