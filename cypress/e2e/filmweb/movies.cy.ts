const movieName = "Kevin sam w domu";
const movieActor = "Macaulay Culkin";

describe("Testing filmweb.pl", () => {
    let data;

    before(function () {
        cy.fixture("filmweb").then(function (fixturesData) {
            console.log(fixturesData);
            data = fixturesData;
        });
    });
    describe("Test filmweb.pl homepage", () => {
        it("should have proper title", () => {
            cy.visit("/");
            cy.title().should("equal", data.websiteTitle);
        });

        it("should display the privacy info popup", () => { // powinno wyświetlić wyskakujące okienko z informacjami o prywatności
            cy.visit("/");
            cy.get(".didomi-popup-container").should("be.visible");
        });
        it("privacy info popup should get closed, when confirm button is clicked", () => { //Wyskakujące okienko z informacjami o prywatności powinno zostać zamknięte po kliknięciu przycisku Potwierdź
            cy.visit("/");
            cy.get("#didomi-notice-agree-button").click();
            cy.get(".didomi-popup-container").should("not.exist");
        });
    });

    describe("Searching for movie", () => { //szukanie filmu
        before(() => {
            cy.visit("/");
            cy.get("#didomi-notice-agree-button").click();
            cy.wait(20000);
        });

        it("search box appears in the header", () => { //pole wyszukwiania wyświetla się w nagłówku
            cy.get("#inputSearch").should("be.visible");
        });

        it("searched movie should appear in the search results", () => { // wyszukiwany film powinien pojawić się w wynikach wyszukiwania

            cy.get("#inputSearch").click();
            cy.get("form input").focus().type(data.movieName); //wpisanie wartości do inputa tekstowego
            cy.contains(".resultItem__main", data.movieName).should("exist");
        });

        it("clicking search result should initiate page redirection to subpage", () => { //kliknięcie wyniku wyszukiwania powinno zainicjować przekierowanie strony na podstronę

            cy.contains(".resultItem__main", data.movieName).click();
            cy.get("#didomi-notice-agree-button").click();
            cy.wait(20000);
            cy.contains(".filmCoverSection__title", data.movieName).should("exist"); // czy na te podstronie znajduje sie tytul filmu
        });

        it("movie details page, should present movie cast", () => { // strona ze szczegółami filmu, powinna przedstawiać obsadę filmu
            cy.contains(".simplePoster__heading", data.movieActor).should("exist");
        });

        it("movie details page, should present related movies", () => { // strona ze szczegółami filmu, powinna przedstawiać powiązane filmy
            cy.get(".filmMainRelatedsSection__wrapper")
                .children()
                .should("have.length.at.least", 1);
        });
        it("movie details page has 2 visible ratings - users, and critics", () => { // Strona ze szczegółami filmu ma 2 widoczne oceny - użytkowników i krytyków
            cy.get(".filmRating--hasPanel").should("exist");
            cy.get(".filmRating--filmCritic").should("exist");
        });
    });
    describe("Testing oscar awards page for movie", () => { // Testowanie strony z nagrodami oscarów dla filmu
        before(() => {
            cy.visit("/awards/Oscary/2022");
            cy.get("#didomi-notice-agree-button").click(); 
        });

        it(`It should have all oscar categories listed"`, () => { // Powinien mieć wymienione wszystkie kategorie Oscarów
            data.oscarCategoryNames.forEach((oscarCategory) => { 
                cy.contains(".categoryName", oscarCategory).should("exist");  
            });

        });
    });

    describe("Testing VOD movies page", () => {
        before(() => {
            cy.visit("/ranking/vod/film");
            cy.get("#didomi-notice-agree-button").click(); 
            cy.wait(20000);
        });

        it(`It should have filter buttons for each VOD platform`, () => { // Powinien mieć przyciski filtrowania dla każdej platformy VOD
            data.VODFilterButtons.forEach((vodTitle) => {
                cy.get('[title="' + vodTitle + '"]').should("exist");
            });
        });
    });
});

