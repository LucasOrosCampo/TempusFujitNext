﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using cs_backend.Infrastructure;

#nullable disable

namespace cs_backend.Infrastructure.Migrations
{
    [DbContext(typeof(MyDbContext))]
    [Migration("20241114224813_create-sessions")]
    partial class createsessions
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.10");

            modelBuilder.Entity("cs_backend.Infrastructure.PersistedModels.GroupState", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserStateUserName")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("UserName");

                    b.HasIndex("UserStateUserName");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("cs_backend.Infrastructure.PersistedModels.SessionState", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("End")
                        .HasColumnType("TEXT");

                    b.Property<int>("GroupId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Start")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("cs_backend.Infrastructure.PersistedModels.UserState", b =>
                {
                    b.Property<string>("UserName")
                        .HasColumnType("TEXT");

                    b.Property<string>("HashedPassword")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UserName");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("cs_backend.Infrastructure.PersistedModels.GroupState", b =>
                {
                    b.HasOne("cs_backend.Infrastructure.PersistedModels.UserState", "User")
                        .WithMany()
                        .HasForeignKey("UserName")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("cs_backend.Infrastructure.PersistedModels.UserState", null)
                        .WithMany("Groups")
                        .HasForeignKey("UserStateUserName");

                    b.Navigation("User");
                });

            modelBuilder.Entity("cs_backend.Infrastructure.PersistedModels.SessionState", b =>
                {
                    b.HasOne("cs_backend.Infrastructure.PersistedModels.GroupState", "Group")
                        .WithMany()
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");
                });

            modelBuilder.Entity("cs_backend.Infrastructure.PersistedModels.UserState", b =>
                {
                    b.Navigation("Groups");
                });
#pragma warning restore 612, 618
        }
    }
}
