<?php

namespace App\Http\Controllers\Api;

use App\Models\ContactForm;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class ContactFormController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|regex:/^[a-zA-Z\s\-\.\']+$/',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|regex:/^[0-9\+\-\(\)\s]+$/',
                'course' => 'nullable|string|max:500',
                'query' => 'nullable|string|max:2000',
            ]);

            $sanitized = [
                'name' => strip_tags(trim($validated['name'])),
                'email' => filter_var(trim($validated['email']), FILTER_SANITIZE_EMAIL),
                'phone' => preg_replace('/[^0-9\+\-\(\)\s]/', '', trim($validated['phone'] ?? '')),
                'course' => htmlspecialchars(strip_tags(trim($validated['course'] ?? '')), ENT_QUOTES, 'UTF-8'),
                'query' => htmlspecialchars(strip_tags(trim($validated['query'] ?? '')), ENT_QUOTES, 'UTF-8'),
            ];

            $contactForm = ContactForm::create($sanitized);

            return response()->json([
                'success' => true,
                'message' => 'Contact form submitted successfully',
                'data' => $contactForm
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating contact form',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
