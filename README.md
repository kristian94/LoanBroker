# LoanBroker - Gruppe 4
Da vi alle har lavet forskellige komponenter, og dermed har mange mapper og kodefiler er de ikke alle samlet et sted. Vi linker derfor til de øvrige repos med kode/komponenter.

### Premium Bank and translator:
https://github.com/xNoga/LoanBroker-PremiumBank

### Recip List
https://github.com/xNoga/LoanBroker-RecipList

### Aggregator, Normalizer, BorumBorumBank & translator, XML+JSON-banks translators
https://github.com/CBorum/go-loan-broker

## UML Diagrams

### "Class" diagram
![alt text](https://github.com/kristian94/LoanBroker/blob/master/doc/img/rabbit.png)
Vi har valgt at lave et overfladisk "klasse"-diagram, der viser de enkelte komponenter i forhold til hinanden og deres relationer. Grundet systemets størrelse ville et klassediagram over hele systemet blive utrolig stort, og det ville være umuligt at se de individuelle klasser. 
Som det kan ses på billedet afviger vores system for et ægte LoanBroker system på flere punkter. Vores SOAP-bank har ikke mulighed for at sende svaret videre direkte, og afhænger derfor af en translator, der kan sende svaret fra banken videre i systemet på en message-queue. 
Ligeledes er vi nødt til at koble router'eren sammen med aggregatoren således at vi ved, hvor mange banker routeren kontakter, og dermed hvor mange svar aggregatoren skal vente på. 

### Sequence diagram 
![alt text](https://github.com/kristian94/LoanBroker/blob/master/doc/img/bög-diagram%20(1).png)
Her ses et lille uddrag af vores system som et sekvensdiagram. Da systemet består af mange komponenter, og hvert komponent har utallige af funktionskald har vi lavet et overfladisk sekvensdiagram, der viser flow'et i systemet. Det flow der vises her bruges stort set gennem hele systemet. Grundet systemets størrelse bliver diagrammet "klippet af", da vi umuligt kunne lave et diagram der viser systemet, som ikke ville blive enormt stort. Samtidig beskriver klassediagrammet for oven de manglende elementer som ikke ses på billedet her. 

## Bottlenecks and enhancements

## Testability

## Web service description
