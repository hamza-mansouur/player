        $(document).ready(function() {
            $(this).keydown(function(e) {
                switch(e.which) {
                    // Left, Page up
                    case 37:
                    case 33:
                        if (oDialog != null)
                            prevArticle();
                        else
                            prevPage();
                        e.preventDefault();
                    break;

                    // Right, Page down
                    case 39:
                    case 34:
                        if (oDialog != null)
                            nextArticle();
                        else
                            nextPage();
                        e.preventDefault();
                    break;

                    default: return;
                }
            });
        });
