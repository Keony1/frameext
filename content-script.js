var pdf_page = 1; // the page is always loaded at the pdf page one
var buttonStatus = "show";
var hideButtonStatus = "show";

// nodes
var prev;
var next;
var commentCardHeader;
var presentations;
var buttonTab;
var inputNumber;
var hideAllCheckedBtn;

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
svg.setAttribute("aria-hidden", "true");
svg.setAttribute("viewbox", "0 0 16 16");
svg.setAttribute("width", "16px");
svg.setAttribute("height", "16px");
path.setAttribute("fill", "#B8C1CF");
path.setAttribute(
  "d",
  "M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm-.77 10.756l4.352-4.359a.75.75 0 0 0-1.062-1.06l-4.352 4.36a.75.75 0 1 0 1.061 1.06zm.001-1.064L5.096 7.56a.75.75 0 0 0-1.06 1.062l2.136 2.132a.75.75 0 1 0 1.06-1.062z",
);
svg.appendChild(path);

function eventClickToGetPage(node) {
  const pg = getCommentDivPage(node);

  pdf_page = pg;
}

function commentDivIsChecked(commentDiv) {
  const buttonChecked = commentDiv.children[0].children[0].children[1];
  if (!buttonChecked) {
    return false;
  }
  return buttonChecked.children[1].className.includes("Checked");
}

function getCommentDivPage(commentDiv) {
  try {
    if (commentDiv.className.includes("comment-card__no-comments")) {
      return -1;
    }

    if (commentDiv.className.includes("TooltipContent__TooltipContainer")) {
      return -1;
    }

    let pg =
      commentDiv.children[0].children[1].children[0].children[0].innerText;

    if (pg && !pg.includes("pg.")) {
      pg = commentDiv.children[0].children[2].children[0].children[0].innerText;
    }

    if (!pg) {
      return 0; // used when div dont have, for example "pg. 03" text
    }

    pg = Number(pg.replace(/\D/g, ""));
    return pg;
  } catch (err) {}
}

function setReviewsVisibility() {
  for (const comment of presentations.children) {
    const commentPage = getCommentDivPage(comment);
    if (commentPage === -1) {
      return;
    }

    if (
      commentPage !== pdf_page &&
      comment.style.display !== "none" &&
      buttonStatus === "hide"
    ) {
      comment.style.display = "none";
    } else if (
      commentPage !== pdf_page &&
      comment.style.display === "none" &&
      buttonStatus === "show"
    ) {
      comment.style.display = "block";
    } else if (
      commentPage === pdf_page &&
      comment.style.display === "none" &&
      buttonStatus === "hide"
    ) {
      comment.style.display = "block";
    } else if (
      commentPage !== pdf_page &&
      comment.style.display === "none" &&
      buttonStatus === "show"
    ) {
      comment.style.dispay = "block";
    } else if (
      commentPage !== pdf_page &&
      comment.style.display === "none" &&
      buttonStatus === "hide"
    ) {
      comment.style.dispay = "none";
    }
  }

  updateCommentCounter();
}

function updateCommentCounter() {
  let count = 0;
  let total = presentations.children.length;

  for (const comment of presentations.children) {
    if (comment.style.display !== "none") {
      count++;
    }
  }

  var cmt = "Comments";
  if (buttonStatus === "hide") {
    if (total === 1) {
      cmt = "Comment";
    }
    buttonTab.innerHTML = `<span>${count} of ${total} ${cmt}</span>`;
  } else {
    if (count === 1) {
      cmt = "Comment";
    }
    buttonTab.innerHTML = `<span>${count} ${cmt}</span>`;
  }
}

function createToggleCommentsButton() {
  const btn = document.createElement("button");
  btn.id = "ext-btn";
  btn.classList.add("flex");
  btn.classList.add("items-center");
  btn.classList.add("justify-start");
  btn.classList.add("bn");
  btn.classList.add("button-reset");
  btn.classList.add("bg-transparent");
  btn.classList.add("white");
  btn.classList.add("pointer");
  btn.classList.add("pl2");
  btn.title = "Current page only";
  btn.style.lineHeight = "18px";
  btn.style.fontSize = "13px";
  btn.style.color = "#aab3c4";

  svg.style.marginRight = "5px";

  btn.appendChild(svg);
  btn.appendChild(new Text("All Pages"));

  commentCardHeader.children[0].style.display = "flex"; // align the div that contains the button
  if (commentCardHeader.children[0].children[0].id !== btn.id) {
    commentCardHeader.children[0].prepend(btn);
  }

  // do the filter
  btn.addEventListener("click", () => {
    if (btn.textContent === "All Pages") {
      buttonStatus = "hide";
      btn.textContent = "";
      btn.appendChild(svg);
      btn.appendChild(new Text("Current Page"));
    } else {
      buttonStatus = "show";
      btn.textContent = "";
      btn.appendChild(svg);
      btn.appendChild(new Text("All Pages"));
    }

    setReviewsVisibility();
  });
}

var docReady = false;
var obs = new MutationObserver(function (mutations, observer) {
  for (let mutation of mutations) {
    if (mutation.type === "childList" && !docReady) {
      commentCardHeader = document.querySelector(
        ".comment-card__header-search-container",
      );

      presentations = document.querySelector(
        ".scroller__container > .relative",
      );

      if (presentations) {
        docReady = true;
        const reviewObs = new MutationObserver((mutationsList, observer) => {
          for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
              for (let node of mutation.addedNodes) {
                if (
                  node.children[0]?.getAttribute("role") === "presentation" &&
                  node.children[0]?.className.includes("Comment__StyledComment")
                ) {
                  if (node.nodeType === 1) {
                    node.addEventListener("click", (_) => {
                      eventClickToGetPage(node);
                    });

                    if (buttonStatus === "hide") {
                      let pg = getCommentDivPage(node);
                      if (pg !== pdf_page) {
                        setReviewsVisibility();
                      }
                    }
                  }
                }
              }
            }
            //observer.disconnect();
          }
        });
        reviewObs.observe(presentations, { childList: true });
      }

      prev = document.querySelector('[aria-label="Previous Page"]');
      next = document.querySelector('[aria-label="Next Page"]');

      inputNumber = document.querySelector("input[type=number]");
      if (inputNumber) {
        inputNumber.addEventListener("input", (event) => {
          if (!isNaN(event.target.value)) {
            pdf_page = Number(event.target.value);
          }
          setReviewsVisibility();
        });
      }

      buttonTab = document.querySelector(".detail-pane__tab-container");
      if (buttonTab) {
        buttonTab = buttonTab.children[0].children[0].children[0];
        const buttonTabObs = new MutationObserver((list, observer) => {
          for (const mutation of list) {
            if (mutation.type === "childList") {
              for (let node of mutation.addedNodes) {
                if (node.nodeType === 3) {
                  setReviewsVisibility();
                }
              }
            }
          }
        });
        buttonTabObs.observe(buttonTab, { childList: true });
      }

      if (commentCardHeader) {
        createToggleCommentsButton();
      }

      if (prev && next) {
        prev.addEventListener("click", function () {
          if (pdf_page == 1) return;
          pdf_page = pdf_page - 1;
          setReviewsVisibility();
        });

        next.addEventListener("click", function () {
          // get the total of pages that the pdf has
          pdf_page = pdf_page + 1;
          setReviewsVisibility();
        });
      }

      hideAllCheckedBtn = document.querySelector(
        ".comment-card__header__hide-complete",
      );
      if (hideAllCheckedBtn) {
        hideAllCheckedBtn.removeChild(hideAllCheckedBtn.children[0]);
        const span = document.createElement("span");
        span.innerText = "Shown";
        span.style.marginRight = "5px";
        hideAllCheckedBtn.prepend(span);

        hideAllCheckedBtn.addEventListener("click", (_) => {
          if (span.innerText === "Shown") {
            hideButtonStatus = "hide";
            span.innerText = "Hidden";
          } else {
            hideButtonStatus = "show";
            span.innerText = "Shown";
          }

          updateCommentCounter();
          //setReviewsVisibility();
        });
      }
    }
  }
});

obs.observe(document.body, {
  childList: true,
  subtree: true,
});

document.onkeydown = function (e) {
  if (e.key === "ArrowRight") {
    pdf_page = pdf_page + 1;
  } else if (e.key === "ArrowLeft") {
    if (pdf_page == 1) return;
    pdf_page = pdf_page - 1;
  }
  setReviewsVisibility();
};

// To work with refresh and navigation with MutationObserver,
// in common portuguese from brazil: a little "gambiarra"
var ch = new Text("");
document.body.appendChild(ch);
document.body.removeChild(ch);
