import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact, ContactRequest } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/contacts';

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.endpoint);
  }

  create(contact: ContactRequest): Observable<Contact> {
    return this.http.post<Contact>(this.endpoint, contact);
  }

  update(id: number, contact: ContactRequest): Observable<Contact> {
    return this.http.put<Contact>(`${this.endpoint}/${id}`, contact);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}