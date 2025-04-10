from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import db, Listing
import os
import stripe


app = Flask(__name__)

# ---------- KEYS ----------
app.secret_key = 'term-project'

# ---------- ROUTES ----------

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/listings')
def listings():
    all_listings = Listing.query.all()
    return render_template('listings.html', listings=all_listings)


@app.route('/listing/<int:listing_id>')
def listing_detail(listing_id):
    listing = Listing.query.get_or_404(listing_id)
    return render_template('listing_detail.html', listing=listing)

@app.route('/add-listing', methods=['GET', 'POST'])
def add_listing():
    if request.method == 'POST':
        title = request.form['title']
        founder = request.form['founder']
        description = request.form['description']
        goal = float(request.form['goal'])
        image1 = request.form['image1']
        image2 = request.form['image2']
        video = request.form['video']

        new_listing = Listing(
            title=title,
            founder=founder,
            description=description,
            goal=goal,
            image1=image1,
            image2=image2,
            video=video
        )
        db.session.add(new_listing)
        db.session.commit()
        flash('Listing created successfully!')
        return redirect(url_for('listings'))

    return render_template('add_listing.html')

@app.route('/fund-listing', methods=['POST'])
def fund_listing():
    data = request.get_json()
    listing_id = data.get('listing_id')
    amount = data.get('amount')

    listing = Listing.query.get_or_404(listing_id)
    listing.raised += float(amount)
    db.session.commit()

    return jsonify({'new_total': listing.raised})

@app.route('/create-checkout-session/<int:listing_id>', methods=['POST'])
def create_checkout_session(listing_id):
    listing = Listing.query.get_or_404(listing_id)

    # 👇 Get custom amount from form
    amount = float(request.form['amount'])

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': f"Funding for {listing.title}",
                },
                'unit_amount': int(amount * 100),  # Stripe requires cents
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=url_for('listings', _external=True) + '?success=true',
        cancel_url=url_for('listing_detail', listing_id=listing.id, _external=True),
    )

    return redirect(session.url, code=303)



@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/api/my-account')
def my_account_api():
    # For now, we're using all listings as "your listings"
    listings = Listing.query.all()

    # Mock fundings for now (or pull from DB later)
    fundings = [
        {"title": "AI for Seniors", "amount": 100},
        {"title": "Eco Coffee Truck", "amount": 250}
    ]

    # ✅ Analytics calculation
    total_raised = sum([l.raised for l in listings])
    goal_total = sum([l.goal for l in listings])
    percent_funded = round((total_raised / goal_total) * 100, 2) if goal_total else 0

    return jsonify({
        "my_listings": [{
            "title": l.title,
            "goal": l.goal,
            "raised": l.raised,
            "id": l.id,
            "image": l.image1 or ''
        } for l in listings],
        "my_fundings": fundings,
        "analytics": {
            "total_raised": total_raised,
            "percent_funded": percent_funded
        }
    })

@app.route('/api/delete-listing/<int:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    listing = Listing.query.get_or_404(listing_id)
    db.session.delete(listing)
    db.session.commit()
    return jsonify({'status': 'deleted'})


@app.route('/mentors')
def mentors():
    sample_mentors = ['Tina F.', 'James D.', 'Elena V.']
    return render_template('mentors.html', mentors=sample_mentors)

@app.cli.command('create-db')
def create_db():
    db.create_all()
    print("📦 Database created successfully!")


# ---------- RUN ----------
if __name__ == '__main__':
    app.run(debug=True)
