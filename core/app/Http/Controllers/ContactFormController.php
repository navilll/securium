<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\ContactForm;
use Illuminate\Http\Request;

class ContactFormController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search');
        $contactForms = ContactForm::filter(['search' => $search])->orderBy('id', 'desc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'course' => $item->course,
                'phone' => $item->phone,
                'query' => $item->query,
                'created_at' => $item->created_at,
            ];
        });

        return Inertia::render('ContactForm/Index', [
            'contactForms' => $contactForms,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function destroy(Request $request, ContactForm $contactForm)
    {
        $contactForm->delete();
        return back()->with('success', 'Contact form deleted successfully!');
    }
}
