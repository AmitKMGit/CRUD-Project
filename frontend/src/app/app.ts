import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact, ContactCategory } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly formBuilder = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  @ViewChild('contactDialog') private contactDialog!: ElementRef<HTMLDialogElement>;

  readonly contacts = signal<Contact[]>([]);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('ALL');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly toastMessage = signal('');
  readonly visibleContacts = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    return this.contacts().filter((contact) => {
      const matchesCategory = category === 'ALL' || contact.category === category;
      const searchable = `${contact.name} ${contact.email} ${contact.company ?? ''} ${contact.phone ?? ''}`.toLowerCase();
      return matchesCategory && searchable.includes(query);
    });
  });
  readonly clientCount = computed(() => this.contacts().filter((contact) => contact.category === 'CLIENT').length);
  readonly partnerCount = computed(() => this.contacts().filter((contact) => contact.category === 'PARTNER').length);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    company: ['', Validators.maxLength(120)],
    phone: ['', Validators.maxLength(40)],
    category: ['CLIENT' as ContactCategory, Validators.required],
  });

  editingId: number | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.contactService.getAll().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not reach the API. Make sure the Spring Boot server is running on port 8080.');
        this.loading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }

  openCreateDialog(): void {
    this.editingId = null;
    this.form.reset({ name: '', email: '', company: '', phone: '', category: 'CLIENT' });
    this.contactDialog.nativeElement.showModal();
  }

  openEditDialog(contact: Contact): void {
    this.editingId = contact.id;
    this.form.reset({
      name: contact.name,
      email: contact.email,
      company: contact.company ?? '',
      phone: contact.phone ?? '',
      category: contact.category,
    });
    this.contactDialog.nativeElement.showModal();
  }

  closeDialog(): void {
    this.contactDialog.nativeElement.close();
  }

  saveContact(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);
    this.errorMessage.set('');
    const request = this.form.getRawValue();
    const isNewContact = this.editingId === null;
    const operation = isNewContact
      ? this.contactService.create(request)
      : this.contactService.update(this.editingId!, request);

    operation.subscribe({
      next: () => {
        this.closeDialog();
        this.saving.set(false);
        this.showToast(isNewContact ? 'Contact added' : 'Contact updated');
        this.loadContacts();
      },
      error: () => {
        this.saving.set(false);
        this.errorMessage.set('Could not save this contact. Check the details and try again.');
      },
    });
  }

  deleteContact(contact: Contact): void {
    if (!window.confirm(`Remove ${contact.name} from your contacts?`)) return;

    this.contactService.delete(contact.id).subscribe({
      next: () => {
        this.showToast('Contact removed');
        this.loadContacts();
      },
      error: () => this.errorMessage.set('Could not remove this contact. Please try again.'),
    });
  }

  categoryLabel(category: ContactCategory): string {
    return category.charAt(0) + category.slice(1).toLowerCase();
  }

  initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(''), 2500);
  }
}
