import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Hero } from "./hero";
import { HEROES } from "./mock-heroes";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messagaeService: MessageService
  ) {}

  private log(message: string) {
    this.messagaeService.add("HeroService: ${message}");
  }

  getHeroNo404<Data>(id:number):Observable<Hero>{
    const url='${this.heroesUrl}/?id=${id}';
    return this.http.get<Hero[]>(url)
    .pipe(
      map(heroes=>heroes[0]),//returns a {0|1} element array
      tap(h=>{
        const outcome=h?'fetched':'did not find';
        this.log('${outcome} hero id=${id}');
      }),
      catchError(this.handleError<Hero>('getHero id=${id}'))
    );
  }
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log("${operation}failed: ${error.message}");
      return of(result as T);
    };
  }

  private heroesUrl = "api/heroes";

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log("fetched heroes")),
      catchError(this.handleError<Hero[]>("getHeroes", []))
    );
  }

  updateHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log("updated hero id=${hero.id}")),
      catchError(this.handleError<Hero[]>("updateHeroes", []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = "${this.heroesUrl}/${id}";
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log("fetched hero id=${id}")),
      catchError(this.handleError<Hero>("getHero id=${id}"))
    );
  }
  upgradeHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl,hero,this.httpOptions).pipe(
      tap(_ => this.log('updated hero id=${hero.id}')),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json'})
  };

  addHero(hero:Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl,hero, this.httpOptions).pipe(
      tap((newHero:Hero)=>this.log('added hero w/ id=${newHero.id}')),
      catchError(this.handleError<Hero>('addedHero'))
    );
  }

  /* DELETE: delete the hero from the server */
  deleteHero(hero: Hero|number):Observable<Hero>{
    const id=typeof hero==='number' ? hero:hero.id;
    const url ='${this.heroesUrl}/${id}';

    return this.http.delete<Hero>(url,this.httpOptions).pipe(
      tap(_=>this.log('delete hero id=${id}')),
        catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /*Get heroes whose name contains search term */
  searchHeroes(term:string):Observable<Hero[]>{
    if(!term.trim()){
      //term을 찾지 못하면 빈 배열을 리턴
      return of([]);
    }
    return this.http.get<Hero[]>('${this.heroesUrl}/?name=${term}').pipe(
      tap(_ => this.log('found heroes matching "${term}"')),
      catchError(this.handleError<Hero[]>('searchHeroes',[]))
    );
  }
}
