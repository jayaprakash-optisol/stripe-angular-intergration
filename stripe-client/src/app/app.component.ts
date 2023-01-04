import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'stripe-client';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  handlePayment(): void {
    this.http
      .post('http://localhost:5000/api/checkout', {
        items: [
          {
            id: 1,
            name: 'Laptop',
            price: 500,
          },
          {
            id: 2,
            name: 'Phone',
            price: 200,
          },
        ],
      })
      .subscribe(async (res: any) => {
        console.log('res', res);
        let stripe = await loadStripe('STRIPE_PUBLISHABLE_KEY_HERE');
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
