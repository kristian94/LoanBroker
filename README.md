# LoanBroker - Gruppe 4
Da vi alle har lavet forskellige komponenter, og dermed har mange mapper og kodefiler er de ikke alle samlet et sted. Vi linker derfor til de øvrige repos med kode/komponenter.

### Premium Bank and translator:
https://github.com/xNoga/LoanBroker-PremiumBank

### Recip List
https://github.com/xNoga/LoanBroker-RecipList

### Aggregator, Normalizer, BorumBorumBank & translator, XML+JSON-banks translators
https://github.com/CBorum/go-loan-broker

## Process flow scenario

## UML Diagrams

### "Class" diagram
![alt text](https://github.com/kristian94/LoanBroker/blob/master/doc/img/rabbit.png)


Vi har valgt at lave et overfladisk "klasse"-diagram, der viser de enkelte komponenter i forhold til hinanden og deres relationer. Grundet systemets størrelse ville et klassediagram over hele systemet blive utrolig stort, og det ville være umuligt at se de individuelle klasser. 
Som det kan ses på billedet afviger vores system fra et ægte LoanBroker system på flere punkter. Vores SOAP-bank har ikke mulighed for at sende svaret videre direkte, og afhænger derfor af en translator, der kan sende svaret fra banken videre i systemet på en message-queue. 
Ligeledes er vi nødt til at koble router'eren sammen med aggregatoren således at vi ved, hvor mange banker routeren kontakter, og dermed hvor mange svar aggregatoren skal vente på. 

### Sequence diagram 
![alt text](https://github.com/kristian94/LoanBroker/blob/master/doc/img/bög-diagram%20(1).png)


Her ses et lille uddrag af vores system som et sekvensdiagram. Da systemet består af mange komponenter, og hvert komponent har utallige af funktionskald har vi lavet et overfladisk sekvensdiagram, der viser flow'et i systemet. Det flow der vises her bruges stort set gennem hele systemet. Grundet systemets størrelse bliver diagrammet "klippet af", da vi umuligt kunne lave et diagram der viser systemet, som ikke ville blive enormt stort. Samtidig beskriver klassediagrammet for oven de manglende elementer som ikke ses på billedet her. 

## Bottlenecks and enhancements

### Normalizer
Normalizer komponentet kunne have bestået af en router og x antal translators, vi har dog valgt at lave en funktion der formaterer et response, om enten det er JSON eller XML, og derved har vi ikke en lang række translators der skal kodes og holdes styr på.

```go
func parseLoanResponse(body []byte) (le *bankutil.LoanResponse, err error) {
	le = &bankutil.LoanResponse{}
	// Parses normal JSON response
	err = json.Unmarshal(body, le)
	if err != nil {
		// Parses normal XML response
		err = xml.Unmarshal(body, le)
		if err != nil {
			cphle := &bankutil.CPHLoanResponse{}
			// Parses JSON response from cphbusiness.BankJSON
			err = json.Unmarshal(body, cphle)
			if err != nil {
				return
			}
			le.InterestRate = cphle.InterestRate
			ssn := strconv.Itoa(cphle.Ssn)
			if len(ssn) < 5 {
				err = errors.New("Short ssn error")
				return
			}
			le.Ssn = ssn[:len(ssn)-4] + "-" + ssn[len(ssn)-4:]
		}
	}
	if le.InterestRate == 0 || le.Ssn == "" {
		err = errors.New("Malformed request")
	}
	return
}
```
### Aggregator
Fra vores Router bliver der sendt en message til Aggregator, der beskriver hvor mange resultater der skal ventes på, f.eks. at der skal ventes på tre resultater fra ssn: 123456-1234.
Hvis der ikke bliver modtaget en message fra Router, bliver der ventet to sekunder før det bedste resultat bliver sendt tilbage, ellers hvis der er to resultater klar bliver de sendt videre med det samme. På denne måde kan vi returnere et resultat meget hurtigt, da vi ved hvornår vi skal stoppe med at lytte på flere svar på et bestemt ssn nummer, og dermed bliver Aggregator ikke en bottleneck. Dog hvis en af bankerne ikke giver noget svar, vil det tage længere tid, men stadig fungerer.


## Testability

## Web service description
