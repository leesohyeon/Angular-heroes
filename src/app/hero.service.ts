import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Hero } from "./hero";
import { HEROES } from "./mock-heroes";
import{MessageService} from './message.service';

@Injectable({
  providedIn: "root"
})
export class HeroService {

  constructor(private messagaeService: MessageService) {}

  getHeroes(): Observable<Hero[]>{
    this.messagaeService.add('HeroService: fetched heroes');
    return of(HEROES);
  }

  getHero(id: number): Observable<Hero> {
    this.messagaeService.add('HeroService: fetched heroes id=${id}');
    return of(HEROES.find(hero=>hero.id === id));
  }

}
