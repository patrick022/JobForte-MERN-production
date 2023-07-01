import { useAppContext } from "../context/appContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext();

  //will make an array with length depending on num of pages
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });

  let displayedPages = pages;

  if (numOfPages > 6) {
    const maxPages = 6;
    const ellipsis = "...";

    if (page > maxPages - 3) {
      displayedPages = [
        1,
        ellipsis,
        ...pages.slice(page - (maxPages - 4), page + 1),
      ];
    } else if (page < maxPages - 3) {
      displayedPages = [...pages.slice(0, maxPages - 1), ellipsis, numOfPages];
    }
  }

  const prevPage = () => {
    let newPage = page - 1;
    if (newPage < 1) {
      newPage = numOfPages;
    }
    changePage(newPage);
  };

  const nextPage = () => {
    let newPage = page + 1;
    if (newPage > numOfPages) {
      newPage = 1;
    }
    changePage(newPage);
  };

  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {displayedPages.map((pageNumber) => {
          return (
            <button
              type="button"
              className={pageNumber === page ? "pageBtn active" : "pageBtn"}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};
export default PageBtnContainer;
