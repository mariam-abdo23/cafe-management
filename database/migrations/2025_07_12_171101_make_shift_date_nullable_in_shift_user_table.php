<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shift_user', function (Blueprint $table) {
            $table->date('shift_date')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('shift_user', function (Blueprint $table) {
            $table->date('shift_date')->nullable(false)->change();
        });
    }
};
