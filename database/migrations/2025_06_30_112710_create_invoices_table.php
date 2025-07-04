<?php

use App\Models\Order;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
                   $table->id();
                   $table->foreignIdFor(Order::class);
                 $table->decimal('amount', 8, 2);
                 $table->enum('payment_method', ['cash', 'card', 'online'])->default('cash');
                 $table->enum('status', ['paid', 'unpaid'])->default('unpaid');
                 $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
