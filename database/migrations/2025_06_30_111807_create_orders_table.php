<?php

use App\Models\DiningTable;
use App\Models\User;
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
        Schema::create('orders', function (Blueprint $table) {
             $table->id();
             $table->foreignIdFor(User::class);
             $table->foreignIdFor(DiningTable::class);
             $table->enum('status', ['pending', 'preparing', 'ready', 'delivered' , 'cancelled'])->default('pending');
              $table->decimal('total_price', 8, 2)->default(0);
             $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
