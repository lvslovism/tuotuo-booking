export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  booking: {
    Tables: {
      ai_daily_metrics: {
        Row: {
          ai_generated: number | null
          ai_replies: number | null
          avg_response_time_ms: number | null
          avg_similarity_score: number | null
          booking_from_chat: number | null
          created_at: string | null
          faq_exact_hits: number | null
          faq_semantic_hits: number | null
          handoff_count: number | null
          helpful_count: number | null
          id: string
          intent_distribution: Json | null
          merchant_code: string
          metric_date: string
          negative_count: number | null
          neutral_count: number | null
          new_threads: number | null
          not_helpful_count: number | null
          positive_count: number | null
          template_replies: number | null
          total_input_tokens: number | null
          total_messages: number | null
          total_output_tokens: number | null
          unique_customers: number | null
          urgent_count: number | null
          user_messages: number | null
        }
        Insert: {
          ai_generated?: number | null
          ai_replies?: number | null
          avg_response_time_ms?: number | null
          avg_similarity_score?: number | null
          booking_from_chat?: number | null
          created_at?: string | null
          faq_exact_hits?: number | null
          faq_semantic_hits?: number | null
          handoff_count?: number | null
          helpful_count?: number | null
          id?: string
          intent_distribution?: Json | null
          merchant_code: string
          metric_date: string
          negative_count?: number | null
          neutral_count?: number | null
          new_threads?: number | null
          not_helpful_count?: number | null
          positive_count?: number | null
          template_replies?: number | null
          total_input_tokens?: number | null
          total_messages?: number | null
          total_output_tokens?: number | null
          unique_customers?: number | null
          urgent_count?: number | null
          user_messages?: number | null
        }
        Update: {
          ai_generated?: number | null
          ai_replies?: number | null
          avg_response_time_ms?: number | null
          avg_similarity_score?: number | null
          booking_from_chat?: number | null
          created_at?: string | null
          faq_exact_hits?: number | null
          faq_semantic_hits?: number | null
          handoff_count?: number | null
          helpful_count?: number | null
          id?: string
          intent_distribution?: Json | null
          merchant_code?: string
          metric_date?: string
          negative_count?: number | null
          neutral_count?: number | null
          new_threads?: number | null
          not_helpful_count?: number | null
          positive_count?: number | null
          template_replies?: number | null
          total_input_tokens?: number | null
          total_messages?: number | null
          total_output_tokens?: number | null
          unique_customers?: number | null
          urgent_count?: number | null
          user_messages?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_daily_metrics_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "ai_daily_metrics_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      ai_prompt_versions: {
        Row: {
          avg_response_time_ms: number | null
          avg_satisfaction: number | null
          booking_conversion_rate: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          merchant_code: string
          persona_section: string | null
          rules_section: string | null
          style_section: string | null
          system_prompt: string
          total_conversations: number | null
          traffic_weight: number | null
          version_tag: string
        }
        Insert: {
          avg_response_time_ms?: number | null
          avg_satisfaction?: number | null
          booking_conversion_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          merchant_code: string
          persona_section?: string | null
          rules_section?: string | null
          style_section?: string | null
          system_prompt: string
          total_conversations?: number | null
          traffic_weight?: number | null
          version_tag: string
        }
        Update: {
          avg_response_time_ms?: number | null
          avg_satisfaction?: number | null
          booking_conversion_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          merchant_code?: string
          persona_section?: string | null
          rules_section?: string | null
          style_section?: string | null
          system_prompt?: string
          total_conversations?: number | null
          traffic_weight?: number | null
          version_tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_versions_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "ai_prompt_versions_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      ai_response_ratings: {
        Row: {
          admin_action: string | null
          admin_note: string | null
          admin_reviewed: boolean | null
          comment: string | null
          created_at: string | null
          customer_line_user_id: string
          id: string
          merchant_code: string
          message_id: string
          rating: string
          reviewed_at: string | null
        }
        Insert: {
          admin_action?: string | null
          admin_note?: string | null
          admin_reviewed?: boolean | null
          comment?: string | null
          created_at?: string | null
          customer_line_user_id: string
          id?: string
          merchant_code: string
          message_id: string
          rating: string
          reviewed_at?: string | null
        }
        Update: {
          admin_action?: string | null
          admin_note?: string | null
          admin_reviewed?: boolean | null
          comment?: string | null
          created_at?: string | null
          customer_line_user_id?: string
          id?: string
          merchant_code?: string
          message_id?: string
          rating?: string
          reviewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_response_ratings_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "ai_response_ratings_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "ai_response_ratings_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "conversation_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_suggestions: {
        Row: {
          approved_faq_id: string | null
          ask_count: number | null
          created_at: string | null
          first_asked_at: string | null
          id: string
          last_asked_at: string | null
          merchant_code: string
          related_faq_id: string | null
          reviewed_at: string | null
          reviewed_note: string | null
          sample_messages: Json | null
          status: string | null
          suggested_answer: string
          suggested_category: string | null
          suggested_keywords: string[] | null
          suggested_question: string
          type: string
          unique_askers: number | null
          updated_at: string | null
        }
        Insert: {
          approved_faq_id?: string | null
          ask_count?: number | null
          created_at?: string | null
          first_asked_at?: string | null
          id?: string
          last_asked_at?: string | null
          merchant_code: string
          related_faq_id?: string | null
          reviewed_at?: string | null
          reviewed_note?: string | null
          sample_messages?: Json | null
          status?: string | null
          suggested_answer: string
          suggested_category?: string | null
          suggested_keywords?: string[] | null
          suggested_question: string
          type?: string
          unique_askers?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_faq_id?: string | null
          ask_count?: number | null
          created_at?: string | null
          first_asked_at?: string | null
          id?: string
          last_asked_at?: string | null
          merchant_code?: string
          related_faq_id?: string | null
          reviewed_at?: string | null
          reviewed_note?: string | null
          sample_messages?: Json | null
          status?: string | null
          suggested_answer?: string
          suggested_category?: string | null
          suggested_keywords?: string[] | null
          suggested_question?: string
          type?: string
          unique_askers?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_approved_faq_id_fkey"
            columns: ["approved_faq_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_suggestions_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "ai_suggestions_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "ai_suggestions_related_faq_id_fkey"
            columns: ["related_faq_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          merchant_code: string
          performed_by: string | null
          performed_by_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          merchant_code: string
          performed_by?: string | null
          performed_by_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          merchant_code?: string
          performed_by?: string | null
          performed_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "audit_logs_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      automation_logs: {
        Row: {
          action_detail: Json | null
          action_type: string
          converted_at: string | null
          converted_booking_id: string | null
          created_at: string | null
          customer_id: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          merchant_code: string
          notification_log_id: string | null
          rule_id: string
          skip_reason: string | null
          status: string
        }
        Insert: {
          action_detail?: Json | null
          action_type: string
          converted_at?: string | null
          converted_booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          merchant_code: string
          notification_log_id?: string | null
          rule_id: string
          skip_reason?: string | null
          status?: string
        }
        Update: {
          action_detail?: Json | null
          action_type?: string
          converted_at?: string | null
          converted_booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          merchant_code?: string
          notification_log_id?: string | null
          rule_id?: string
          skip_reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_converted_booking_id_fkey"
            columns: ["converted_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "automation_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "automation_logs_notification_log_id_fkey"
            columns: ["notification_log_id"]
            isOneToOne: false
            referencedRelation: "notification_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action_config: Json
          action_type: string
          category: string
          cooldown_days: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          last_triggered_at: string | null
          max_executions_per_customer: number | null
          merchant_code: string
          name: string
          priority: number | null
          target_filter: Json | null
          total_converted: number | null
          total_triggered: number | null
          trigger_config: Json
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          action_config?: Json
          action_type: string
          category: string
          cooldown_days?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          last_triggered_at?: string | null
          max_executions_per_customer?: number | null
          merchant_code: string
          name: string
          priority?: number | null
          target_filter?: Json | null
          total_converted?: number | null
          total_triggered?: number | null
          trigger_config?: Json
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          action_config?: Json
          action_type?: string
          category?: string
          cooldown_days?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          last_triggered_at?: string | null
          max_executions_per_customer?: number | null
          merchant_code?: string
          name?: string
          priority?: number | null
          target_filter?: Json | null
          total_converted?: number | null
          total_triggered?: number | null
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "automation_rules_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      booking_funnel_events: {
        Row: {
          booking_id: string | null
          created_at: string
          customer_id: string | null
          failure_detail: string | null
          failure_reason: string | null
          id: string
          line_user_id: string | null
          merchant_code: string
          metadata: Json | null
          resource_id: string | null
          selected_date: string | null
          selected_time: string | null
          service_id: string | null
          session_id: string
          step: string
          step_index: number | null
          user_agent: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          failure_detail?: string | null
          failure_reason?: string | null
          id?: string
          line_user_id?: string | null
          merchant_code: string
          metadata?: Json | null
          resource_id?: string | null
          selected_date?: string | null
          selected_time?: string | null
          service_id?: string | null
          session_id: string
          step: string
          step_index?: number | null
          user_agent?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          failure_detail?: string | null
          failure_reason?: string | null
          id?: string
          line_user_id?: string | null
          merchant_code?: string
          metadata?: Json | null
          resource_id?: string | null
          selected_date?: string | null
          selected_time?: string | null
          service_id?: string | null
          session_id?: string
          step?: string
          step_index?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_funnel_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_funnel_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_funnel_events_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "booking_funnel_events_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "booking_funnel_events_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_funnel_events_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_items: {
        Row: {
          booking_id: string
          created_at: string | null
          duration_minutes: number
          id: string
          merchant_code: string
          price: number
          resource_id: string | null
          service_id: string
          sort_order: number | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          duration_minutes: number
          id?: string
          merchant_code: string
          price: number
          resource_id?: string | null
          service_id: string
          sort_order?: number | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          duration_minutes?: number
          id?: string
          merchant_code?: string
          price?: number
          resource_id?: string | null
          service_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "booking_items_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "booking_items_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_status_history: {
        Row: {
          booking_id: string
          changed_by: string
          changed_by_id: string | null
          created_at: string | null
          from_status: string | null
          id: string
          merchant_code: string
          reason: string | null
          to_status: string
        }
        Insert: {
          booking_id: string
          changed_by: string
          changed_by_id?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          merchant_code: string
          reason?: string | null
          to_status: string
        }
        Update: {
          booking_id?: string
          changed_by?: string
          changed_by_id?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          merchant_code?: string
          reason?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_status_history_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "booking_status_history_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      bookings: {
        Row: {
          applied_price_type: string | null
          arrived_at: string | null
          booked_by_line_user_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          checked_in_method: string | null
          completed_at: string | null
          created_at: string | null
          customer_gender: string | null
          customer_id: string | null
          customer_line_user_id: string | null
          customer_name: string | null
          customer_note: string | null
          customer_phone: string | null
          discount_amount: number | null
          discount_code_id: string | null
          duration_minutes: number | null
          end_time: string
          final_price: number | null
          group_id: string | null
          group_index: number | null
          group_size: number | null
          id: string
          internal_note: string | null
          loyalty_stamp_id: string | null
          merchant_code: string
          no_show_risk_score: number | null
          original_price: number | null
          package_usage_id: string | null
          payment_method: string | null
          payment_status: string | null
          price: number | null
          recurring_rule_id: string | null
          referral_record_id: string | null
          reschedule_count: number | null
          rescheduled_at: string | null
          rescheduled_from_id: string | null
          resource_id: string | null
          resource_name: string | null
          risk_factors: Json | null
          service_done_at: string | null
          service_id: string
          service_name: string | null
          session_count: number | null
          source: string | null
          start_time: string
          status: string | null
          stored_value_card_id: string | null
          stored_value_txn_id: string | null
          suggested_revisit_at: string | null
          updated_at: string | null
          welcome_credit_used: number | null
        }
        Insert: {
          applied_price_type?: string | null
          arrived_at?: string | null
          booked_by_line_user_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          checked_in_method?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_gender?: string | null
          customer_id?: string | null
          customer_line_user_id?: string | null
          customer_name?: string | null
          customer_note?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          discount_code_id?: string | null
          duration_minutes?: number | null
          end_time: string
          final_price?: number | null
          group_id?: string | null
          group_index?: number | null
          group_size?: number | null
          id?: string
          internal_note?: string | null
          loyalty_stamp_id?: string | null
          merchant_code: string
          no_show_risk_score?: number | null
          original_price?: number | null
          package_usage_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price?: number | null
          recurring_rule_id?: string | null
          referral_record_id?: string | null
          reschedule_count?: number | null
          rescheduled_at?: string | null
          rescheduled_from_id?: string | null
          resource_id?: string | null
          resource_name?: string | null
          risk_factors?: Json | null
          service_done_at?: string | null
          service_id: string
          service_name?: string | null
          session_count?: number | null
          source?: string | null
          start_time: string
          status?: string | null
          stored_value_card_id?: string | null
          stored_value_txn_id?: string | null
          suggested_revisit_at?: string | null
          updated_at?: string | null
          welcome_credit_used?: number | null
        }
        Update: {
          applied_price_type?: string | null
          arrived_at?: string | null
          booked_by_line_user_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          checked_in_method?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_gender?: string | null
          customer_id?: string | null
          customer_line_user_id?: string | null
          customer_name?: string | null
          customer_note?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          discount_code_id?: string | null
          duration_minutes?: number | null
          end_time?: string
          final_price?: number | null
          group_id?: string | null
          group_index?: number | null
          group_size?: number | null
          id?: string
          internal_note?: string | null
          loyalty_stamp_id?: string | null
          merchant_code?: string
          no_show_risk_score?: number | null
          original_price?: number | null
          package_usage_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price?: number | null
          recurring_rule_id?: string | null
          referral_record_id?: string | null
          reschedule_count?: number | null
          rescheduled_at?: string | null
          rescheduled_from_id?: string | null
          resource_id?: string | null
          resource_name?: string | null
          risk_factors?: Json | null
          service_done_at?: string | null
          service_id?: string
          service_name?: string | null
          session_count?: number | null
          source?: string | null
          start_time?: string
          status?: string | null
          stored_value_card_id?: string | null
          stored_value_txn_id?: string | null
          suggested_revisit_at?: string | null
          updated_at?: string | null
          welcome_credit_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "bookings_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "bookings_referral_record_id_fkey"
            columns: ["referral_record_id"]
            isOneToOne: false
            referencedRelation: "referral_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_rescheduled_from_id_fkey"
            columns: ["rescheduled_from_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_sync_logs: {
        Row: {
          action: string
          booking_id: string | null
          created_at: string | null
          direction: string
          error_message: string | null
          gcal_event_id: string | null
          id: string
          merchant_code: string
          resource_id: string
          status: string | null
        }
        Insert: {
          action: string
          booking_id?: string | null
          created_at?: string | null
          direction: string
          error_message?: string | null
          gcal_event_id?: string | null
          id?: string
          merchant_code: string
          resource_id: string
          status?: string | null
        }
        Update: {
          action?: string
          booking_id?: string | null
          created_at?: string | null
          direction?: string
          error_message?: string | null
          gcal_event_id?: string | null
          id?: string
          merchant_code?: string
          resource_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sync_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sync_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "calendar_sync_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "calendar_sync_logs_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_records: {
        Row: {
          booking_amount: number | null
          booking_id: string | null
          commission_amount: number | null
          commission_type: string | null
          commission_value: number | null
          created_at: string | null
          id: string
          merchant_code: string
          paid_at: string | null
          period_month: string | null
          pos_transaction_id: string | null
          resource_id: string
          service_name: string | null
          status: string | null
        }
        Insert: {
          booking_amount?: number | null
          booking_id?: string | null
          commission_amount?: number | null
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string | null
          id?: string
          merchant_code: string
          paid_at?: string | null
          period_month?: string | null
          pos_transaction_id?: string | null
          resource_id: string
          service_name?: string | null
          status?: string | null
        }
        Update: {
          booking_amount?: number | null
          booking_id?: string | null
          commission_amount?: number | null
          commission_type?: string | null
          commission_value?: number | null
          created_at?: string | null
          id?: string
          merchant_code?: string
          paid_at?: string | null
          period_month?: string | null
          pos_transaction_id?: string | null
          resource_id?: string
          service_name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_records_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "commission_records_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      commission_rules: {
        Row: {
          commission_type: string
          commission_value: number
          created_at: string | null
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean | null
          merchant_code: string
          resource_id: string | null
          service_id: string | null
        }
        Insert: {
          commission_type: string
          commission_value: number
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          merchant_code: string
          resource_id?: string | null
          service_id?: string | null
        }
        Update: {
          commission_type?: string
          commission_value?: number
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean | null
          merchant_code?: string
          resource_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_rules_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "commission_rules_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "commission_rules_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_rules_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          created_at: string | null
          customer_line_user_id: string
          handoff_reason: string | null
          id: string
          intent: string | null
          intent_confidence: number | null
          is_handoff: boolean | null
          matched_faq_id: string | null
          merchant_code: string
          message_type: string | null
          prompt_version_id: string | null
          response_source: string | null
          response_time_ms: number | null
          role: string
          sentiment: string | null
          sentiment_score: number | null
          similarity_score: number | null
          source: string | null
          source_event_id: string | null
          thread_id: string | null
          token_count_input: number | null
          token_count_output: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          customer_line_user_id: string
          handoff_reason?: string | null
          id?: string
          intent?: string | null
          intent_confidence?: number | null
          is_handoff?: boolean | null
          matched_faq_id?: string | null
          merchant_code: string
          message_type?: string | null
          prompt_version_id?: string | null
          response_source?: string | null
          response_time_ms?: number | null
          role: string
          sentiment?: string | null
          sentiment_score?: number | null
          similarity_score?: number | null
          source?: string | null
          source_event_id?: string | null
          thread_id?: string | null
          token_count_input?: number | null
          token_count_output?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          customer_line_user_id?: string
          handoff_reason?: string | null
          id?: string
          intent?: string | null
          intent_confidence?: number | null
          is_handoff?: boolean | null
          matched_faq_id?: string | null
          merchant_code?: string
          message_type?: string | null
          prompt_version_id?: string | null
          response_source?: string | null
          response_time_ms?: number | null
          role?: string
          sentiment?: string | null
          sentiment_score?: number | null
          similarity_score?: number | null
          source?: string | null
          source_event_id?: string | null
          thread_id?: string | null
          token_count_input?: number | null
          token_count_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conv_msg_prompt_fk"
            columns: ["prompt_version_id"]
            isOneToOne: false
            referencedRelation: "ai_prompt_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_messages_matched_faq_id_fkey"
            columns: ["matched_faq_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_messages_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "conversation_messages_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "conversation_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_threads: {
        Row: {
          ai_reply_count: number | null
          created_at: string | null
          customer_line_user_id: string
          faq_hit_count: number | null
          flag_note: string | null
          id: string
          is_flagged: boolean | null
          last_message_at: string | null
          merchant_code: string
          message_count: number | null
          outcome: string | null
          overall_sentiment: string | null
          started_at: string | null
          topic_summary: string | null
        }
        Insert: {
          ai_reply_count?: number | null
          created_at?: string | null
          customer_line_user_id: string
          faq_hit_count?: number | null
          flag_note?: string | null
          id?: string
          is_flagged?: boolean | null
          last_message_at?: string | null
          merchant_code: string
          message_count?: number | null
          outcome?: string | null
          overall_sentiment?: string | null
          started_at?: string | null
          topic_summary?: string | null
        }
        Update: {
          ai_reply_count?: number | null
          created_at?: string | null
          customer_line_user_id?: string
          faq_hit_count?: number | null
          flag_note?: string | null
          id?: string
          is_flagged?: boolean | null
          last_message_at?: string | null
          merchant_code?: string
          message_count?: number | null
          outcome?: string | null
          overall_sentiment?: string | null
          started_at?: string | null
          topic_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_threads_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "conversation_threads_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      conversations: {
        Row: {
          context: Json | null
          created_at: string | null
          current_flow: string | null
          current_step: string | null
          customer_line_user_id: string
          expires_at: string | null
          id: string
          merchant_code: string
          updated_at: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          current_flow?: string | null
          current_step?: string | null
          customer_line_user_id: string
          expires_at?: string | null
          id?: string
          merchant_code: string
          updated_at?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          current_flow?: string | null
          current_step?: string | null
          customer_line_user_id?: string
          expires_at?: string | null
          id?: string
          merchant_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "conversations_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          booking_id: string | null
          created_at: string
          credit_type: string
          customer_id: string
          id: string
          merchant_code: string
          notes: string | null
          txn_type: string
        }
        Insert: {
          amount: number
          balance_after: number
          booking_id?: string | null
          created_at?: string
          credit_type?: string
          customer_id: string
          id?: string
          merchant_code: string
          notes?: string | null
          txn_type: string
        }
        Update: {
          amount?: number
          balance_after?: number
          booking_id?: string | null
          created_at?: string
          credit_type?: string
          customer_id?: string
          id?: string
          merchant_code?: string
          notes?: string | null
          txn_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_credit_txn_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_credit_txn_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_credit_txn_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "fk_credit_txn_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      customer_packages: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_line_user_id: string
          expires_at: string
          gateway_transaction_id: string | null
          id: string
          merchant_code: string
          package_id: string
          purchased_at: string | null
          remaining_sessions: number
          status: string | null
          total_sessions: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_line_user_id: string
          expires_at: string
          gateway_transaction_id?: string | null
          id?: string
          merchant_code: string
          package_id: string
          purchased_at?: string | null
          remaining_sessions: number
          status?: string | null
          total_sessions: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_line_user_id?: string
          expires_at?: string
          gateway_transaction_id?: string | null
          id?: string
          merchant_code?: string
          package_id?: string
          purchased_at?: string | null
          remaining_sessions?: number
          status?: string | null
          total_sessions?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_packages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_packages_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "customer_packages_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "customer_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_preferences: {
        Row: {
          allergies: string | null
          auto_learned: boolean | null
          confidence_score: number | null
          created_at: string | null
          customer_id: string
          id: string
          last_suggested_date: string | null
          merchant_code: string
          personal_notes: string | null
          preferred_day_of_week: number[] | null
          preferred_language: string | null
          preferred_resource_id: string | null
          preferred_service_id: string | null
          preferred_time_end: string | null
          preferred_time_start: string | null
          reminder_preference: string | null
          suggested_interval_days: number | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string | null
          auto_learned?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          customer_id: string
          id?: string
          last_suggested_date?: string | null
          merchant_code: string
          personal_notes?: string | null
          preferred_day_of_week?: number[] | null
          preferred_language?: string | null
          preferred_resource_id?: string | null
          preferred_service_id?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          reminder_preference?: string | null
          suggested_interval_days?: number | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string | null
          auto_learned?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          customer_id?: string
          id?: string
          last_suggested_date?: string | null
          merchant_code?: string
          personal_notes?: string | null
          preferred_day_of_week?: number[] | null
          preferred_language?: string | null
          preferred_resource_id?: string | null
          preferred_service_id?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          reminder_preference?: string | null
          suggested_interval_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_preferences_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "customer_preferences_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "customer_preferences_preferred_resource_id_fkey"
            columns: ["preferred_resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_preferences_preferred_service_id_fkey"
            columns: ["preferred_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          avg_booking_interval_days: number | null
          birthday: string | null
          blocked_reason: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          first_visit_at: string | null
          gender: string | null
          health_form_completed: boolean | null
          health_form_completed_at: string | null
          health_form_remind_count: number | null
          health_form_reminded: boolean | null
          id: string
          internal_notes: string | null
          is_blocked: boolean | null
          is_new_customer: boolean | null
          last_booking_at: string | null
          last_visit_at: string | null
          lifecycle_stage: string | null
          lifecycle_updated_at: string | null
          lifetime_value: number | null
          line_user_id: string | null
          merchant_code: string
          metadata: Json | null
          no_show_count: number | null
          phone: string | null
          picture_url: string | null
          preferred_resource_id: string | null
          real_name: string | null
          referral_code: string | null
          referred_by_customer_id: string | null
          risk_score: number | null
          tags: string[] | null
          total_bookings: number | null
          total_spent: number | null
          total_visits: number | null
          updated_at: string | null
          welcome_credit: number | null
        }
        Insert: {
          avg_booking_interval_days?: number | null
          birthday?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_visit_at?: string | null
          gender?: string | null
          health_form_completed?: boolean | null
          health_form_completed_at?: string | null
          health_form_remind_count?: number | null
          health_form_reminded?: boolean | null
          id?: string
          internal_notes?: string | null
          is_blocked?: boolean | null
          is_new_customer?: boolean | null
          last_booking_at?: string | null
          last_visit_at?: string | null
          lifecycle_stage?: string | null
          lifecycle_updated_at?: string | null
          lifetime_value?: number | null
          line_user_id?: string | null
          merchant_code: string
          metadata?: Json | null
          no_show_count?: number | null
          phone?: string | null
          picture_url?: string | null
          preferred_resource_id?: string | null
          real_name?: string | null
          referral_code?: string | null
          referred_by_customer_id?: string | null
          risk_score?: number | null
          tags?: string[] | null
          total_bookings?: number | null
          total_spent?: number | null
          total_visits?: number | null
          updated_at?: string | null
          welcome_credit?: number | null
        }
        Update: {
          avg_booking_interval_days?: number | null
          birthday?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_visit_at?: string | null
          gender?: string | null
          health_form_completed?: boolean | null
          health_form_completed_at?: string | null
          health_form_remind_count?: number | null
          health_form_reminded?: boolean | null
          id?: string
          internal_notes?: string | null
          is_blocked?: boolean | null
          is_new_customer?: boolean | null
          last_booking_at?: string | null
          last_visit_at?: string | null
          lifecycle_stage?: string | null
          lifecycle_updated_at?: string | null
          lifetime_value?: number | null
          line_user_id?: string | null
          merchant_code?: string
          metadata?: Json | null
          no_show_count?: number | null
          phone?: string | null
          picture_url?: string | null
          preferred_resource_id?: string | null
          real_name?: string | null
          referral_code?: string | null
          referred_by_customer_id?: string | null
          risk_score?: number | null
          tags?: string[] | null
          total_bookings?: number | null
          total_spent?: number | null
          total_visits?: number | null
          updated_at?: string | null
          welcome_credit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "customers_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "customers_preferred_resource_id_fkey"
            columns: ["preferred_resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_referred_by_customer_id_fkey"
            columns: ["referred_by_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_revenue_stats: {
        Row: {
          avg_rating: number | null
          avg_utilization: number | null
          busiest_resource_id: string | null
          cancelled_bookings: number | null
          completed_bookings: number | null
          created_at: string | null
          credit_deducted: number | null
          high_risk_bookings: number | null
          id: string
          manual_discount: number | null
          merchant_code: string
          net_revenue: number | null
          new_bookings: number | null
          new_customers: number | null
          no_show_bookings: number | null
          peak_hour: number | null
          resource_utilization: Json | null
          returning_customers: number | null
          revenue_cancelled: number | null
          revenue_cash: number | null
          revenue_completed: number | null
          revenue_confirmed: number | null
          revenue_stored_value: number | null
          reviews_count: number | null
          risk_prevented: number | null
          stat_date: string
          total_bookings: number | null
          unique_customers: number | null
          waitlist_additions: number | null
          waitlist_conversions: number | null
        }
        Insert: {
          avg_rating?: number | null
          avg_utilization?: number | null
          busiest_resource_id?: string | null
          cancelled_bookings?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          credit_deducted?: number | null
          high_risk_bookings?: number | null
          id?: string
          manual_discount?: number | null
          merchant_code: string
          net_revenue?: number | null
          new_bookings?: number | null
          new_customers?: number | null
          no_show_bookings?: number | null
          peak_hour?: number | null
          resource_utilization?: Json | null
          returning_customers?: number | null
          revenue_cancelled?: number | null
          revenue_cash?: number | null
          revenue_completed?: number | null
          revenue_confirmed?: number | null
          revenue_stored_value?: number | null
          reviews_count?: number | null
          risk_prevented?: number | null
          stat_date: string
          total_bookings?: number | null
          unique_customers?: number | null
          waitlist_additions?: number | null
          waitlist_conversions?: number | null
        }
        Update: {
          avg_rating?: number | null
          avg_utilization?: number | null
          busiest_resource_id?: string | null
          cancelled_bookings?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          credit_deducted?: number | null
          high_risk_bookings?: number | null
          id?: string
          manual_discount?: number | null
          merchant_code?: string
          net_revenue?: number | null
          new_bookings?: number | null
          new_customers?: number | null
          no_show_bookings?: number | null
          peak_hour?: number | null
          resource_utilization?: Json | null
          returning_customers?: number | null
          revenue_cancelled?: number | null
          revenue_cash?: number | null
          revenue_completed?: number | null
          revenue_confirmed?: number | null
          revenue_stored_value?: number | null
          reviews_count?: number | null
          risk_prevented?: number | null
          stat_date?: string
          total_bookings?: number | null
          unique_customers?: number | null
          waitlist_additions?: number | null
          waitlist_conversions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_revenue_stats_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "daily_revenue_stats_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      daily_staff_stats: {
        Row: {
          available_slots: number | null
          cancelled_bookings: number | null
          completed_bookings: number | null
          created_at: string | null
          credit_deducted: number | null
          id: string
          merchant_code: string
          new_customers: number | null
          no_show_bookings: number | null
          resource_id: string
          returning_customers: number | null
          revenue_completed: number | null
          revenue_standard: number | null
          revenue_stored_value: number | null
          stat_date: string
          total_bookings: number | null
          unique_customers: number | null
          utilization_rate: number | null
        }
        Insert: {
          available_slots?: number | null
          cancelled_bookings?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          credit_deducted?: number | null
          id?: string
          merchant_code: string
          new_customers?: number | null
          no_show_bookings?: number | null
          resource_id: string
          returning_customers?: number | null
          revenue_completed?: number | null
          revenue_standard?: number | null
          revenue_stored_value?: number | null
          stat_date: string
          total_bookings?: number | null
          unique_customers?: number | null
          utilization_rate?: number | null
        }
        Update: {
          available_slots?: number | null
          cancelled_bookings?: number | null
          completed_bookings?: number | null
          created_at?: string | null
          credit_deducted?: number | null
          id?: string
          merchant_code?: string
          new_customers?: number | null
          no_show_bookings?: number | null
          resource_id?: string
          returning_customers?: number | null
          revenue_completed?: number | null
          revenue_standard?: number | null
          revenue_stored_value?: number | null
          stat_date?: string
          total_bookings?: number | null
          unique_customers?: number | null
          utilization_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_stats_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "fk_staff_stats_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "fk_staff_stats_resource"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_code_usages: {
        Row: {
          booking_id: string | null
          customer_id: string | null
          discount_amount: number
          discount_code_id: string
          id: string
          merchant_code: string
          used_at: string | null
        }
        Insert: {
          booking_id?: string | null
          customer_id?: string | null
          discount_amount: number
          discount_code_id: string
          id?: string
          merchant_code: string
          used_at?: string | null
        }
        Update: {
          booking_id?: string | null
          customer_id?: string | null
          discount_amount?: number
          discount_code_id?: string
          id?: string
          merchant_code?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_code_usages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_code_usages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_code_usages_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discount_code_usages_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "discount_code_usages_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      discount_codes: {
        Row: {
          applicable_services: string[] | null
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          max_uses: number | null
          max_uses_per_customer: number | null
          merchant_code: string
          min_order_amount: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_services?: string[] | null
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          max_uses?: number | null
          max_uses_per_customer?: number | null
          merchant_code: string
          min_order_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_services?: string[] | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          max_uses?: number | null
          max_uses_per_customer?: number | null
          merchant_code?: string
          min_order_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "discount_codes_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      domain_events: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          consumers_processed: Json | null
          created_at: string | null
          event_data: Json
          event_type: string
          id: string
          merchant_code: string
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          consumers_processed?: Json | null
          created_at?: string | null
          event_data?: Json
          event_type: string
          id?: string
          merchant_code: string
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          consumers_processed?: Json | null
          created_at?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          merchant_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_domain_events_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "fk_domain_events_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      gift_cards: {
        Row: {
          card_code: string
          card_type: string
          created_at: string | null
          expires_at: string
          gift_message: string | null
          id: string
          merchant_code: string
          original_amount: number | null
          payment_method: string | null
          payment_reference: string | null
          purchased_at: string | null
          purchaser_email: string | null
          purchaser_line_user_id: string | null
          purchaser_name: string | null
          purchaser_phone: string | null
          recipient_email: string | null
          recipient_line_user_id: string | null
          recipient_name: string | null
          recipient_phone: string | null
          redeemed_booking_ids: string[] | null
          remaining_amount: number | null
          service_id: string | null
          sessions_total: number | null
          sessions_used: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          card_code: string
          card_type?: string
          created_at?: string | null
          expires_at: string
          gift_message?: string | null
          id?: string
          merchant_code: string
          original_amount?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          purchased_at?: string | null
          purchaser_email?: string | null
          purchaser_line_user_id?: string | null
          purchaser_name?: string | null
          purchaser_phone?: string | null
          recipient_email?: string | null
          recipient_line_user_id?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          redeemed_booking_ids?: string[] | null
          remaining_amount?: number | null
          service_id?: string | null
          sessions_total?: number | null
          sessions_used?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          card_code?: string
          card_type?: string
          created_at?: string | null
          expires_at?: string
          gift_message?: string | null
          id?: string
          merchant_code?: string
          original_amount?: number | null
          payment_method?: string | null
          payment_reference?: string | null
          purchased_at?: string | null
          purchaser_email?: string | null
          purchaser_line_user_id?: string | null
          purchaser_name?: string | null
          purchaser_phone?: string | null
          recipient_email?: string | null
          recipient_line_user_id?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          redeemed_booking_ids?: string[] | null
          remaining_amount?: number | null
          service_id?: string | null
          sessions_total?: number | null
          sessions_used?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_cards_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "gift_cards_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "gift_cards_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      health_forms: {
        Row: {
          created_at: string | null
          description: string | null
          fields: Json
          id: string
          is_active: boolean | null
          merchant_code: string
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          merchant_code: string
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          merchant_code?: string
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_forms_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "health_forms_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      health_responses: {
        Row: {
          customer_id: string
          form_id: string
          id: string
          merchant_code: string
          responses: Json
          submitted_at: string | null
          version: number | null
        }
        Insert: {
          customer_id: string
          form_id: string
          id?: string
          merchant_code: string
          responses?: Json
          submitted_at?: string | null
          version?: number | null
        }
        Update: {
          customer_id?: string
          form_id?: string
          id?: string
          merchant_code?: string
          responses?: Json
          submitted_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_responses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "health_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_responses_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "health_responses_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      intent_definitions: {
        Row: {
          action_config: Json | null
          action_type: string
          created_at: string | null
          description: string | null
          display_name: string
          example_phrases: string[] | null
          id: string
          intent_key: string
          is_active: boolean | null
          is_system: boolean | null
          merchant_code: string
          negative_phrases: string[] | null
          priority: number | null
          updated_at: string | null
        }
        Insert: {
          action_config?: Json | null
          action_type?: string
          created_at?: string | null
          description?: string | null
          display_name: string
          example_phrases?: string[] | null
          id?: string
          intent_key: string
          is_active?: boolean | null
          is_system?: boolean | null
          merchant_code: string
          negative_phrases?: string[] | null
          priority?: number | null
          updated_at?: string | null
        }
        Update: {
          action_config?: Json | null
          action_type?: string
          created_at?: string | null
          description?: string | null
          display_name?: string
          example_phrases?: string[] | null
          id?: string
          intent_key?: string
          is_active?: boolean | null
          is_system?: boolean | null
          merchant_code?: string
          negative_phrases?: string[] | null
          priority?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intent_definitions_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "intent_definitions_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      inventory_logs: {
        Row: {
          change_type: string
          created_at: string | null
          created_by: string | null
          id: string
          merchant_code: string
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
        }
        Insert: {
          change_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          merchant_code: string
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
        }
        Update: {
          change_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          merchant_code?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "inventory_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          answer: string
          category: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          embedding: string | null
          helpful_count: number | null
          hit_count: number | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          last_hit_at: string | null
          merchant_code: string
          priority: number | null
          question: string | null
          question_variants: string[] | null
          sort_order: number | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          category: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          embedding?: string | null
          helpful_count?: number | null
          hit_count?: number | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          last_hit_at?: string | null
          merchant_code: string
          priority?: number | null
          question?: string | null
          question_variants?: string[] | null
          sort_order?: number | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          embedding?: string | null
          helpful_count?: number | null
          hit_count?: number | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          last_hit_at?: string | null
          merchant_code?: string
          priority?: number | null
          question?: string | null
          question_variants?: string[] | null
          sort_order?: number | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "knowledge_base_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      line_bind_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          merchant_code: string
          resource_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          id?: string
          merchant_code: string
          resource_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          merchant_code?: string
          resource_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "line_bind_tokens_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "line_bind_tokens_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "line_bind_tokens_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          created_at: string | null
          google_map_url: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          merchant_code: string
          name: string
          phone: string | null
          sort_order: number | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          google_map_url?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          merchant_code: string
          name: string
          phone?: string | null
          sort_order?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          google_map_url?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          merchant_code?: string
          name?: string
          phone?: string | null
          sort_order?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "locations_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      loyalty_cards: {
        Row: {
          card_code: string | null
          card_holder_line_user_id: string | null
          completed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          merchant_code: string
          reward_expires_at: string | null
          reward_sessions_granted: number | null
          reward_sessions_used: number | null
          stamps_collected: number | null
          stamps_required: number
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          card_code?: string | null
          card_holder_line_user_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          merchant_code: string
          reward_expires_at?: string | null
          reward_sessions_granted?: number | null
          reward_sessions_used?: number | null
          stamps_collected?: number | null
          stamps_required?: number
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          card_code?: string | null
          card_holder_line_user_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          merchant_code?: string
          reward_expires_at?: string | null
          reward_sessions_granted?: number | null
          reward_sessions_used?: number | null
          stamps_collected?: number | null
          stamps_required?: number
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_cards_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "loyalty_cards_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      loyalty_stamps: {
        Row: {
          booking_id: string | null
          card_id: string
          id: string
          merchant_code: string
          notes: string | null
          stamp_number: number
          stamped_at: string | null
          stamped_by_admin: boolean | null
          stamped_by_line_user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          card_id: string
          id?: string
          merchant_code: string
          notes?: string | null
          stamp_number: number
          stamped_at?: string | null
          stamped_by_admin?: boolean | null
          stamped_by_line_user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          card_id?: string
          id?: string
          merchant_code?: string
          notes?: string | null
          stamp_number?: number
          stamped_at?: string | null
          stamped_by_admin?: boolean | null
          stamped_by_line_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_stamps_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_stamps_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_stamps_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "loyalty_stamps_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      merchant_settings: {
        Row: {
          ai_settings: Json | null
          booking_rules: Json | null
          business_hours: Json | null
          created_at: string | null
          display_settings: Json | null
          health_form_settings: Json | null
          loyalty_settings: Json | null
          merchant_code: string
          metadata: Json | null
          notification_settings: Json | null
          payment_settings: Json | null
          pricing_rules: Json | null
          rich_menu_config: Json | null
          stored_value_settings: Json | null
          updated_at: string | null
        }
        Insert: {
          ai_settings?: Json | null
          booking_rules?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          display_settings?: Json | null
          health_form_settings?: Json | null
          loyalty_settings?: Json | null
          merchant_code: string
          metadata?: Json | null
          notification_settings?: Json | null
          payment_settings?: Json | null
          pricing_rules?: Json | null
          rich_menu_config?: Json | null
          stored_value_settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          ai_settings?: Json | null
          booking_rules?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          display_settings?: Json | null
          health_form_settings?: Json | null
          loyalty_settings?: Json | null
          merchant_code?: string
          metadata?: Json | null
          notification_settings?: Json | null
          payment_settings?: Json | null
          pricing_rules?: Json | null
          rich_menu_config?: Json | null
          stored_value_settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_settings_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: true
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "merchant_settings_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: true
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      notification_logs: {
        Row: {
          booking_id: string | null
          channel: string
          created_at: string | null
          customer_id: string | null
          entity_id: string | null
          error_message: string | null
          id: string
          line_request_id: string | null
          merchant_code: string
          notification_type: string
          recipient_email: string | null
          recipient_line_user_id: string | null
          recipient_phone: string | null
          recipient_type: string
          sent_at: string | null
          status: string
          template_key: string | null
        }
        Insert: {
          booking_id?: string | null
          channel: string
          created_at?: string | null
          customer_id?: string | null
          entity_id?: string | null
          error_message?: string | null
          id?: string
          line_request_id?: string | null
          merchant_code: string
          notification_type: string
          recipient_email?: string | null
          recipient_line_user_id?: string | null
          recipient_phone?: string | null
          recipient_type: string
          sent_at?: string | null
          status?: string
          template_key?: string | null
        }
        Update: {
          booking_id?: string | null
          channel?: string
          created_at?: string | null
          customer_id?: string | null
          entity_id?: string | null
          error_message?: string | null
          id?: string
          line_request_id?: string | null
          merchant_code?: string
          notification_type?: string
          recipient_email?: string | null
          recipient_line_user_id?: string | null
          recipient_phone?: string | null
          recipient_type?: string
          sent_at?: string | null
          status?: string
          template_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "notification_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      notification_templates: {
        Row: {
          available_variables: Json | null
          channel: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          merchant_code: string
          template_body: Json
          template_key: string
          template_type: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          available_variables?: Json | null
          channel?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          merchant_code: string
          template_body: Json
          template_key: string
          template_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          available_variables?: Json | null
          channel?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          merchant_code?: string
          template_body?: Json
          template_key?: string
          template_type?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_templates_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "notification_templates_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          attempts: number
          created_at: string | null
          expires_at: string
          id: string
          is_verified: boolean
          max_attempts: number
          merchant_code: string
          otp_code: string
          phone: string
          purpose: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string | null
          expires_at: string
          id?: string
          is_verified?: boolean
          max_attempts?: number
          merchant_code: string
          otp_code: string
          phone: string
          purpose: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string | null
          expires_at?: string
          id?: string
          is_verified?: boolean
          max_attempts?: number
          merchant_code?: string
          otp_code?: string
          phone?: string
          purpose?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "otp_verifications_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "otp_verifications_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      package_usages: {
        Row: {
          action: string
          booking_id: string | null
          created_at: string | null
          customer_package_id: string
          id: string
          sessions_after: number
          sessions_before: number
        }
        Insert: {
          action: string
          booking_id?: string | null
          created_at?: string | null
          customer_package_id: string
          id?: string
          sessions_after: number
          sessions_before: number
        }
        Update: {
          action?: string
          booking_id?: string | null
          created_at?: string | null
          customer_package_id?: string
          id?: string
          sessions_after?: number
          sessions_before?: number
        }
        Relationships: [
          {
            foreignKeyName: "package_usages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_usages_customer_package_id_fkey"
            columns: ["customer_package_id"]
            isOneToOne: false
            referencedRelation: "customer_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          bonus_sessions: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_transferable: boolean | null
          max_per_customer: number | null
          merchant_code: string
          name: string
          original_price: number
          selling_price: number
          service_id: string | null
          sort_order: number | null
          total_sessions: number
          updated_at: string | null
          validity_days: number | null
        }
        Insert: {
          bonus_sessions?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_transferable?: boolean | null
          max_per_customer?: number | null
          merchant_code: string
          name: string
          original_price: number
          selling_price: number
          service_id?: string | null
          sort_order?: number | null
          total_sessions: number
          updated_at?: string | null
          validity_days?: number | null
        }
        Update: {
          bonus_sessions?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_transferable?: boolean | null
          max_per_customer?: number | null
          merchant_code?: string
          name?: string
          original_price?: number
          selling_price?: number
          service_id?: string | null
          sort_order?: number | null
          total_sessions?: number
          updated_at?: string | null
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "packages_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "packages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          gateway_merchant_trade_no: string | null
          gateway_transaction_id: string | null
          id: string
          merchant_code: string
          metadata: Json | null
          payment_type: string
          refund_amount: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          gateway_merchant_trade_no?: string | null
          gateway_transaction_id?: string | null
          id?: string
          merchant_code: string
          metadata?: Json | null
          payment_type: string
          refund_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          gateway_merchant_trade_no?: string | null
          gateway_transaction_id?: string | null
          id?: string
          merchant_code?: string
          metadata?: Json | null
          payment_type?: string
          refund_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "payments_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      pos_items: {
        Row: {
          booking_id: string | null
          created_at: string | null
          discount: number | null
          id: string
          item_name: string
          item_type: string
          merchant_code: string
          quantity: number | null
          service_id: string | null
          subtotal: number
          transaction_id: string
          unit_price: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          discount?: number | null
          id?: string
          item_name: string
          item_type: string
          merchant_code: string
          quantity?: number | null
          service_id?: string | null
          subtotal: number
          transaction_id: string
          unit_price: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          discount?: number | null
          id?: string
          item_name?: string
          item_type?: string
          merchant_code?: string
          quantity?: number | null
          service_id?: string | null
          subtotal?: number
          transaction_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_items_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "pos_items_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "pos_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_payments: {
        Row: {
          amount: number
          cash_change: number | null
          cash_received: number | null
          created_at: string | null
          id: string
          loyalty_card_id: string | null
          merchant_code: string
          notes: string | null
          payment_method: string
          stored_value_card_id: string | null
          stored_value_txn_id: string | null
          transaction_id: string
        }
        Insert: {
          amount: number
          cash_change?: number | null
          cash_received?: number | null
          created_at?: string | null
          id?: string
          loyalty_card_id?: string | null
          merchant_code: string
          notes?: string | null
          payment_method: string
          stored_value_card_id?: string | null
          stored_value_txn_id?: string | null
          transaction_id: string
        }
        Update: {
          amount?: number
          cash_change?: number | null
          cash_received?: number | null
          created_at?: string | null
          id?: string
          loyalty_card_id?: string | null
          merchant_code?: string
          notes?: string | null
          payment_method?: string
          stored_value_card_id?: string | null
          stored_value_txn_id?: string | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_payments_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "pos_payments_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "pos_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_shifts: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string | null
          id: string
          merchant_code: string
          notes: string | null
          opened_at: string | null
          opened_by: string | null
          shift_date: string
          status: string | null
          total_cash: number | null
          total_credit_card: number | null
          total_loyalty_redeem: number | null
          total_revenue: number | null
          total_stored_value: number | null
          total_transfer: number | null
          transaction_count: number | null
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string | null
          id?: string
          merchant_code: string
          notes?: string | null
          opened_at?: string | null
          opened_by?: string | null
          shift_date: string
          status?: string | null
          total_cash?: number | null
          total_credit_card?: number | null
          total_loyalty_redeem?: number | null
          total_revenue?: number | null
          total_stored_value?: number | null
          total_transfer?: number | null
          transaction_count?: number | null
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string | null
          id?: string
          merchant_code?: string
          notes?: string | null
          opened_at?: string | null
          opened_by?: string | null
          shift_date?: string
          status?: string | null
          total_cash?: number | null
          total_credit_card?: number | null
          total_loyalty_redeem?: number | null
          total_revenue?: number | null
          total_stored_value?: number | null
          total_transfer?: number | null
          transaction_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_shifts_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "pos_shifts_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      pos_transactions: {
        Row: {
          booking_id: string | null
          cashier_id: string | null
          cashier_name: string | null
          created_at: string | null
          customer_id: string | null
          discount_amount: number | null
          id: string
          invoice_number: string | null
          merchant_code: string
          notes: string | null
          resource_id: string | null
          shift_id: string | null
          status: string | null
          subtotal: number
          total_amount: number
          updated_at: string | null
          voided_at: string | null
          voided_by: string | null
          voided_reason: string | null
        }
        Insert: {
          booking_id?: string | null
          cashier_id?: string | null
          cashier_name?: string | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          invoice_number?: string | null
          merchant_code: string
          notes?: string | null
          resource_id?: string | null
          shift_id?: string | null
          status?: string | null
          subtotal: number
          total_amount: number
          updated_at?: string | null
          voided_at?: string | null
          voided_by?: string | null
          voided_reason?: string | null
        }
        Update: {
          booking_id?: string | null
          cashier_id?: string | null
          cashier_name?: string | null
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          invoice_number?: string | null
          merchant_code?: string
          notes?: string | null
          resource_id?: string | null
          shift_id?: string | null
          status?: string | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
          voided_at?: string | null
          voided_by?: string | null
          voided_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "pos_transactions_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "pos_transactions_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "pos_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          cost_price: number | null
          created_at: string | null
          current_stock: number | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          low_stock_alert: number | null
          merchant_code: string
          name: string
          price: number
          sku: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          low_stock_alert?: number | null
          merchant_code: string
          name: string
          price: number
          sku?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          current_stock?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          low_stock_alert?: number | null
          merchant_code?: string
          name?: string
          price?: number
          sku?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "products_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action: string
          created_at: string | null
          id: string
          identifier: string
          identifier_type: string
          merchant_code: string | null
          request_count: number
          window_start: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          identifier: string
          identifier_type: string
          merchant_code?: string | null
          request_count?: number
          window_start?: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          merchant_code?: string | null
          request_count?: number
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rate_limits_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "fk_rate_limits_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      recurring_rules: {
        Row: {
          advance_days: number | null
          auto_book: boolean | null
          completed_occurrences: number | null
          conflict_action: string | null
          created_at: string | null
          custom_interval_days: number | null
          customer_id: string
          day_of_month: number | null
          day_of_week: number | null
          end_date: string | null
          id: string
          last_booked_at: string | null
          merchant_code: string
          next_occurrence_date: string | null
          paused_until: string | null
          preferred_time: string
          recurrence_type: string
          resource_id: string | null
          service_id: string
          start_date: string
          status: string | null
          total_occurrences: number | null
          updated_at: string | null
        }
        Insert: {
          advance_days?: number | null
          auto_book?: boolean | null
          completed_occurrences?: number | null
          conflict_action?: string | null
          created_at?: string | null
          custom_interval_days?: number | null
          customer_id: string
          day_of_month?: number | null
          day_of_week?: number | null
          end_date?: string | null
          id?: string
          last_booked_at?: string | null
          merchant_code: string
          next_occurrence_date?: string | null
          paused_until?: string | null
          preferred_time: string
          recurrence_type: string
          resource_id?: string | null
          service_id: string
          start_date: string
          status?: string | null
          total_occurrences?: number | null
          updated_at?: string | null
        }
        Update: {
          advance_days?: number | null
          auto_book?: boolean | null
          completed_occurrences?: number | null
          conflict_action?: string | null
          created_at?: string | null
          custom_interval_days?: number | null
          customer_id?: string
          day_of_month?: number | null
          day_of_week?: number | null
          end_date?: string | null
          id?: string
          last_booked_at?: string | null
          merchant_code?: string
          next_occurrence_date?: string | null
          paused_until?: string | null
          preferred_time?: string
          recurrence_type?: string
          resource_id?: string | null
          service_id?: string
          start_date?: string
          status?: string | null
          total_occurrences?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_rules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_rules_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "recurring_rules_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "recurring_rules_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_rules_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          customer_id: string
          id: string
          is_active: boolean | null
          merchant_code: string
          total_referrals: number | null
          total_reward_amount: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          customer_id: string
          id?: string
          is_active?: boolean | null
          merchant_code: string
          total_referrals?: number | null
          total_reward_amount?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          is_active?: boolean | null
          merchant_code?: string
          total_referrals?: number | null
          total_reward_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_codes_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "referral_codes_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      referral_records: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          merchant_code: string
          referral_code_id: string
          referred_booking_id: string | null
          referred_customer_id: string
          referred_reward_amount: number | null
          referred_reward_granted: boolean | null
          referred_reward_type: string | null
          referrer_customer_id: string
          referrer_reward_amount: number | null
          referrer_reward_granted: boolean | null
          referrer_reward_type: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          merchant_code: string
          referral_code_id: string
          referred_booking_id?: string | null
          referred_customer_id: string
          referred_reward_amount?: number | null
          referred_reward_granted?: boolean | null
          referred_reward_type?: string | null
          referrer_customer_id: string
          referrer_reward_amount?: number | null
          referrer_reward_granted?: boolean | null
          referrer_reward_type?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          merchant_code?: string
          referral_code_id?: string
          referred_booking_id?: string | null
          referred_customer_id?: string
          referred_reward_amount?: number | null
          referred_reward_granted?: boolean | null
          referred_reward_type?: string | null
          referrer_customer_id?: string
          referrer_reward_amount?: number | null
          referrer_reward_granted?: boolean | null
          referrer_reward_type?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_records_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "referral_records_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "referral_records_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_records_referred_booking_id_fkey"
            columns: ["referred_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_records_referred_customer_id_fkey"
            columns: ["referred_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_records_referrer_customer_id_fkey"
            columns: ["referrer_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          booking_id: string
          created_at: string | null
          error_message: string | null
          id: string
          merchant_code: string
          remind_at: string
          remind_type: string
          sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          merchant_code: string
          remind_at: string
          remind_type?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          merchant_code?: string
          remind_at?: string
          remind_type?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "reminders_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      resource_services: {
        Row: {
          custom_duration: number | null
          custom_price: number | null
          resource_id: string
          service_id: string
        }
        Insert: {
          custom_duration?: number | null
          custom_price?: number | null
          resource_id: string
          service_id: string
        }
        Update: {
          custom_duration?: number | null
          custom_price?: number | null
          resource_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_services_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          accept_booking: boolean | null
          avatar_url: string | null
          bio: string | null
          commission_rate: number | null
          commission_type: string | null
          created_at: string | null
          google_calendar_id: string | null
          google_last_synced_at: string | null
          google_refresh_token: string | null
          id: string
          is_active: boolean | null
          line_user_id: string | null
          max_daily_bookings: number | null
          merchant_code: string
          metadata: Json | null
          name: string
          notify_new_booking: boolean | null
          phone: string | null
          sort_order: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          accept_booking?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          commission_rate?: number | null
          commission_type?: string | null
          created_at?: string | null
          google_calendar_id?: string | null
          google_last_synced_at?: string | null
          google_refresh_token?: string | null
          id?: string
          is_active?: boolean | null
          line_user_id?: string | null
          max_daily_bookings?: number | null
          merchant_code: string
          metadata?: Json | null
          name: string
          notify_new_booking?: boolean | null
          phone?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          accept_booking?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          commission_rate?: number | null
          commission_type?: string | null
          created_at?: string | null
          google_calendar_id?: string | null
          google_last_synced_at?: string | null
          google_refresh_token?: string | null
          id?: string
          is_active?: boolean | null
          line_user_id?: string | null
          max_daily_bookings?: number | null
          merchant_code?: string
          metadata?: Json | null
          name?: string
          notify_new_booking?: boolean | null
          phone?: string | null
          sort_order?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "resources_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          customer_id: string | null
          environment_rating: number | null
          flagged_reason: string | null
          id: string
          is_anonymous: boolean | null
          merchant_code: string
          merchant_replied_at: string | null
          merchant_replied_by: string | null
          merchant_reply: string | null
          overall_rating: number
          resource_id: string | null
          reviewed_by_admin: boolean | null
          service_id: string | null
          service_rating: number | null
          source: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          environment_rating?: number | null
          flagged_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          merchant_code: string
          merchant_replied_at?: string | null
          merchant_replied_by?: string | null
          merchant_reply?: string | null
          overall_rating: number
          resource_id?: string | null
          reviewed_by_admin?: boolean | null
          service_id?: string | null
          service_rating?: number | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          environment_rating?: number | null
          flagged_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          merchant_code?: string
          merchant_replied_at?: string | null
          merchant_replied_by?: string | null
          merchant_reply?: string | null
          overall_rating?: number
          resource_id?: string | null
          reviewed_by_admin?: boolean | null
          service_id?: string | null
          service_rating?: number | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "reviews_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "reviews_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_overrides: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          is_closed: boolean | null
          merchant_code: string
          override_date: string
          reason: string | null
          resource_id: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_closed?: boolean | null
          merchant_code: string
          override_date: string
          reason?: string | null
          resource_id?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_closed?: boolean | null
          merchant_code?: string
          override_date?: string
          reason?: string | null
          resource_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_overrides_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "schedule_overrides_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "schedule_overrides_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          break_end: string | null
          break_start: string | null
          breaks: Json | null
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          is_closed: boolean | null
          merchant_code: string
          resource_id: string | null
          slot_interval_minutes: number | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          breaks?: Json | null
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          is_closed?: boolean | null
          merchant_code: string
          resource_id?: string | null
          slot_interval_minutes?: number | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          breaks?: Json | null
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          is_closed?: boolean | null
          merchant_code?: string
          resource_id?: string | null
          slot_interval_minutes?: number | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "schedules_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "schedules_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          buffer_after_minutes: number | null
          buffer_minutes: number | null
          category: string | null
          created_at: string | null
          deposit_amount: number | null
          description: string | null
          duration_minutes: number
          first_time_price: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          max_advance_days: number | null
          max_concurrent: number | null
          max_party_size: number | null
          max_sessions: number | null
          member_price: number | null
          merchant_code: string
          metadata: Json | null
          min_advance_hours: number | null
          min_sessions: number | null
          name: string
          price: number | null
          price_per_session: number | null
          pricing_type: string | null
          session_minutes: number | null
          sort_order: number | null
          suggested_revisit_days: number | null
          updated_at: string | null
        }
        Insert: {
          buffer_after_minutes?: number | null
          buffer_minutes?: number | null
          category?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          description?: string | null
          duration_minutes?: number
          first_time_price?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_advance_days?: number | null
          max_concurrent?: number | null
          max_party_size?: number | null
          max_sessions?: number | null
          member_price?: number | null
          merchant_code: string
          metadata?: Json | null
          min_advance_hours?: number | null
          min_sessions?: number | null
          name: string
          price?: number | null
          price_per_session?: number | null
          pricing_type?: string | null
          session_minutes?: number | null
          sort_order?: number | null
          suggested_revisit_days?: number | null
          updated_at?: string | null
        }
        Update: {
          buffer_after_minutes?: number | null
          buffer_minutes?: number | null
          category?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          description?: string | null
          duration_minutes?: number
          first_time_price?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_advance_days?: number | null
          max_concurrent?: number | null
          max_party_size?: number | null
          max_sessions?: number | null
          member_price?: number | null
          merchant_code?: string
          metadata?: Json | null
          min_advance_hours?: number | null
          min_sessions?: number | null
          name?: string
          price?: number | null
          price_per_session?: number | null
          pricing_type?: string | null
          session_minutes?: number | null
          sort_order?: number | null
          suggested_revisit_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "services_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      stored_value_cards: {
        Row: {
          balance: number
          card_code: string | null
          created_at: string | null
          denomination: number
          expires_at: string
          holder_line_user_id: string
          id: string
          merchant_code: string
          per_session_price: number
          purchased_at: string | null
          shared_count: number | null
          shared_to_line_user_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          balance: number
          card_code?: string | null
          created_at?: string | null
          denomination: number
          expires_at: string
          holder_line_user_id: string
          id?: string
          merchant_code: string
          per_session_price: number
          purchased_at?: string | null
          shared_count?: number | null
          shared_to_line_user_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          balance?: number
          card_code?: string | null
          created_at?: string | null
          denomination?: number
          expires_at?: string
          holder_line_user_id?: string
          id?: string
          merchant_code?: string
          per_session_price?: number
          purchased_at?: string | null
          shared_count?: number | null
          shared_to_line_user_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stored_value_cards_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "stored_value_cards_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      stored_value_txns: {
        Row: {
          amount: number
          balance_after: number
          booking_id: string | null
          card_id: string
          created_at: string | null
          id: string
          merchant_code: string
          notes: string | null
          txn_type: string
          used_by_line_user_id: string | null
        }
        Insert: {
          amount: number
          balance_after: number
          booking_id?: string | null
          card_id: string
          created_at?: string | null
          id?: string
          merchant_code: string
          notes?: string | null
          txn_type: string
          used_by_line_user_id?: string | null
        }
        Update: {
          amount?: number
          balance_after?: number
          booking_id?: string | null
          card_id?: string
          created_at?: string | null
          id?: string
          merchant_code?: string
          notes?: string | null
          txn_type?: string
          used_by_line_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stored_value_txns_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stored_value_txns_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "stored_value_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stored_value_txns_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "stored_value_txns_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      time_slot_locks: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          locked_by: string
          locked_until: string
          merchant_code: string
          resource_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          locked_by: string
          locked_until: string
          merchant_code: string
          resource_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          locked_by?: string
          locked_until?: string
          merchant_code?: string
          resource_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slot_locks_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "time_slot_locks_merchant_fk"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "time_slot_locks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          any_resource: boolean | null
          confirmed_booking_id: string | null
          created_at: string | null
          customer_id: string | null
          customer_line_user_id: string | null
          customer_name: string | null
          customer_phone: string | null
          expires_at: string | null
          id: string
          max_notifications: number | null
          merchant_code: string
          notification_attempts: number | null
          notified_at: string | null
          notified_slot_resource_id: string | null
          notified_slot_start: string | null
          preferred_dates: string[] | null
          preferred_resource_id: string | null
          preferred_time_end: string | null
          preferred_time_start: string | null
          priority: number | null
          response_deadline: string | null
          service_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          any_resource?: boolean | null
          confirmed_booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_line_user_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          expires_at?: string | null
          id?: string
          max_notifications?: number | null
          merchant_code: string
          notification_attempts?: number | null
          notified_at?: string | null
          notified_slot_resource_id?: string | null
          notified_slot_start?: string | null
          preferred_dates?: string[] | null
          preferred_resource_id?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority?: number | null
          response_deadline?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          any_resource?: boolean | null
          confirmed_booking_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_line_user_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          expires_at?: string | null
          id?: string
          max_notifications?: number | null
          merchant_code?: string
          notification_attempts?: number | null
          notified_at?: string | null
          notified_slot_resource_id?: string | null
          notified_slot_start?: string | null
          preferred_dates?: string[] | null
          preferred_resource_id?: string | null
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          priority?: number | null
          response_deadline?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_confirmed_booking_id_fkey"
            columns: ["confirmed_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "waitlist_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "v_merchants_public"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "waitlist_preferred_resource_id_fkey"
            columns: ["preferred_resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_merchants: {
        Row: {
          address: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          features: Json | null
          google_map_url: string | null
          industry: string | null
          line_channel_id: string | null
          line_liff_id: string | null
          line_login_channel_id: string | null
          line_oa_url: string | null
          logo_url: string | null
          merchant_code: string | null
          phone: string | null
          plan: string | null
          status: string | null
          timezone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          features?: Json | null
          google_map_url?: string | null
          industry?: string | null
          line_channel_id?: string | null
          line_liff_id?: string | null
          line_login_channel_id?: string | null
          line_oa_url?: string | null
          logo_url?: string | null
          merchant_code?: string | null
          phone?: string | null
          plan?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          features?: Json | null
          google_map_url?: string | null
          industry?: string | null
          line_channel_id?: string | null
          line_liff_id?: string | null
          line_login_channel_id?: string | null
          line_oa_url?: string | null
          logo_url?: string | null
          merchant_code?: string | null
          phone?: string | null
          plan?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      v_merchants_public: {
        Row: {
          address: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          features: Json | null
          google_map_url: string | null
          industry: string | null
          line_channel_id: string | null
          line_liff_id: string | null
          line_login_channel_id: string | null
          line_oa_url: string | null
          logo_url: string | null
          merchant_code: string | null
          phone: string | null
          plan: string | null
          status: string | null
          timezone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          features?: Json | null
          google_map_url?: string | null
          industry?: string | null
          line_channel_id?: string | null
          line_liff_id?: string | null
          line_login_channel_id?: string | null
          line_oa_url?: string | null
          logo_url?: string | null
          merchant_code?: string | null
          phone?: string | null
          plan?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          features?: Json | null
          google_map_url?: string | null
          industry?: string | null
          line_channel_id?: string | null
          line_liff_id?: string | null
          line_login_channel_id?: string | null
          line_oa_url?: string | null
          logo_url?: string | null
          merchant_code?: string | null
          phone?: string | null
          plan?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_merchant_code: { Args: never; Returns: string }
      fn_ack_domain_event: {
        Args: { p_consumer: string; p_event_id: string }
        Returns: undefined
      }
      fn_ack_notification: {
        Args: {
          p_error_message?: string
          p_line_request_id?: string
          p_notification_id: string
          p_status?: string
        }
        Returns: boolean
      }
      fn_add_to_waitlist: {
        Args: {
          p_customer_id?: string
          p_customer_line_user_id?: string
          p_customer_name?: string
          p_customer_phone?: string
          p_merchant_code: string
          p_preferred_dates: string[]
          p_preferred_resource_id?: string
          p_preferred_time_end?: string
          p_preferred_time_start?: string
          p_service_id: string
        }
        Returns: Json
      }
      fn_aggregate_ai_daily_metrics: {
        Args: { p_date?: string }
        Returns: undefined
      }
      fn_aggregate_daily_revenue: {
        Args: { p_date?: string }
        Returns: undefined
      }
      fn_aggregate_daily_staff_stats: {
        Args: { p_date?: string }
        Returns: undefined
      }
      fn_apply_discount_code: {
        Args: {
          p_booking_id: string
          p_code: string
          p_customer_id?: string
          p_merchant_code: string
          p_order_amount?: number
          p_service_id?: string
        }
        Returns: Json
      }
      fn_assert_merchant_context: {
        Args: { p_merchant_code: string }
        Returns: undefined
      }
      fn_assign_resource: {
        Args: {
          p_duration_minutes?: number
          p_exclude_resource_ids?: string[]
          p_merchant_code: string
          p_service_id: string
          p_start_time: string
        }
        Returns: Json
      }
      fn_auto_mark_no_show: { Args: never; Returns: Json }
      fn_auto_tag_customer: {
        Args: { p_customer_id: string; p_merchant_code: string }
        Returns: Json
      }
      fn_booking_health_check: { Args: never; Returns: Json }
      fn_calculate_booking_price: {
        Args: {
          p_customer_line_user_id: string
          p_merchant_code: string
          p_service_id: string
          p_total_sessions?: number
          p_use_stored_value?: boolean
        }
        Returns: {
          applied_price_type: string
          credit_available: number
          final_price: number
          group_discount_applied: number
          loyalty_card_id: string
          stored_value_card_id: string
        }[]
      }
      fn_calculate_commission: {
        Args: {
          p_booking_amount: number
          p_booking_id: string
          p_merchant_code: string
          p_pos_transaction_id: string
          p_resource_id: string
          p_service_id: string
        }
        Returns: Json
      }
      fn_cancel_booking: {
        Args: {
          p_booking_id: string
          p_cancelled_by?: string
          p_merchant_code: string
          p_reason?: string
        }
        Returns: Json
      }
      fn_check_birthday_greetings: { Args: never; Returns: Json }
      fn_check_consecutive_limit: {
        Args: {
          p_merchant_code: string
          p_proposed_start: string
          p_resource_id: string
        }
        Returns: Json
      }
      fn_check_feature: {
        Args: { p_feature_key: string; p_merchant_code: string }
        Returns: Json
      }
      fn_check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_identifier_type: string
          p_max_requests?: number
          p_merchant_code?: string
          p_window_minutes?: number
        }
        Returns: Json
      }
      fn_check_revisit_reminders: { Args: never; Returns: Json }
      fn_checkout_booking: {
        Args: {
          p_booking_ids: string[]
          p_cash_received?: number
          p_discount_reason?: string
          p_manual_discount?: number
          p_merchant_code: string
          p_notes?: string
          p_payment_method?: string
          p_stored_value_card_id?: string
          p_use_credit?: boolean
          p_use_stored_value?: boolean
        }
        Returns: Json
      }
      fn_close_shift: {
        Args: {
          p_closed_by?: string
          p_merchant_code: string
          p_notes?: string
          p_shift_id: string
        }
        Returns: Json
      }
      fn_consume_domain_events: {
        Args: { p_consumer: string; p_event_types: string[]; p_limit?: number }
        Returns: {
          aggregate_id: string
          aggregate_type: string
          created_at: string
          event_data: Json
          event_id: string
          event_type: string
          merchant_code: string
        }[]
      }
      fn_consume_pending_notifications: {
        Args: { p_batch_size?: number; p_notification_type?: string }
        Returns: Json
      }
      fn_count_slot_capacity: {
        Args: {
          p_duration_minutes?: number
          p_merchant_code: string
          p_service_id: string
          p_start_time: string
        }
        Returns: number
      }
      fn_create_gift_card: {
        Args: {
          p_amount: number
          p_from_name: string
          p_merchant_code: string
          p_message?: string
          p_to_name: string
          p_validity_days?: number
        }
        Returns: Json
      }
      fn_create_payment_request: {
        Args: {
          p_amount?: number
          p_booking_id: string
          p_merchant_code: string
          p_payment_type?: string
        }
        Returns: Json
      }
      fn_create_recurring_rule: {
        Args: {
          p_advance_days?: number
          p_custom_interval_days?: number
          p_customer_id: string
          p_day_of_week?: number
          p_end_date?: string
          p_merchant_code: string
          p_preferred_time?: string
          p_recurrence_type?: string
          p_resource_id?: string
          p_service_id: string
          p_total_occurrences?: number
        }
        Returns: Json
      }
      fn_create_referral_code: {
        Args: { p_customer_id: string; p_merchant_code: string }
        Returns: Json
      }
      fn_customer_portal: {
        Args: { p_line_user_id: string; p_merchant_code: string }
        Returns: Json
      }
      fn_daily_slot_capacities: {
        Args: {
          p_date: string
          p_merchant_code: string
          p_service_id: string
          p_slot_interval_minutes?: number
        }
        Returns: {
          capacity: number
          slot_time: string
        }[]
      }
      fn_dashboard_stats: { Args: { p_merchant_code: string }; Returns: Json }
      fn_deduct_stored_value: {
        Args: {
          p_amount: number
          p_booking_id: string
          p_card_id: string
          p_merchant_code: string
          p_notes?: string
          p_used_by?: string
        }
        Returns: {
          new_balance: number
          success: boolean
          txn_id: string
        }[]
      }
      fn_deprovision_merchant: {
        Args: { p_confirm?: boolean; p_merchant_code: string }
        Returns: Json
      }
      fn_generate_daily_summary: { Args: never; Returns: Json }
      fn_get_customer_channels: {
        Args: { p_customer_id: string; p_merchant_code: string }
        Returns: Json
      }
      fn_get_line_credentials: {
        Args: { p_merchant_code: string }
        Returns: Json
      }
      fn_get_merchant_features: {
        Args: { p_merchant_code: string }
        Returns: Json
      }
      fn_get_merchant_settings: {
        Args: { p_merchant_code: string }
        Returns: Json
      }
      fn_get_onboarding_line_config: { Args: never; Returns: Json }
      fn_get_pending_platform_push: { Args: never; Returns: Json }
      fn_get_smart_breaks: {
        Args: { p_date: string; p_merchant_code: string; p_resource_id: string }
        Returns: Json
      }
      fn_get_staff_breaks: {
        Args: {
          p_day_of_week: number
          p_merchant_code: string
          p_resource_id: string
        }
        Returns: Json
      }
      fn_get_unsynchronized_bookings: {
        Args: { p_limit?: number }
        Returns: Json
      }
      fn_grant_credit: {
        Args: {
          p_amount: number
          p_credit_type?: string
          p_customer_id: string
          p_merchant_code: string
          p_notes?: string
        }
        Returns: number
      }
      fn_log_ai_conversation: {
        Args: {
          p_ai_response: string
          p_intent?: string
          p_line_user_id: string
          p_matched_faq_id?: string
          p_merchant_code: string
          p_response_source?: string
          p_response_time_ms?: number
          p_sentiment?: string
          p_similarity_score?: number
          p_thread_timeout_minutes?: number
          p_user_message: string
        }
        Returns: Json
      }
      fn_log_calendar_sync: {
        Args: {
          p_action: string
          p_booking_id: string
          p_direction: string
          p_error?: string
          p_gcal_event_id: string
          p_merchant_code: string
          p_resource_id: string
          p_status?: string
        }
        Returns: string
      }
      fn_log_cms_event: { Args: { p_event: Json }; Returns: string }
      fn_log_funnel_event: { Args: { p_event: Json }; Returns: string }
      fn_log_ui_error: { Args: { p_error: Json }; Returns: string }
      fn_manage_discount_codes: {
        Args: { p_action: string; p_data?: Json; p_merchant_code: string }
        Returns: Json
      }
      fn_manage_recurring_rule: {
        Args: {
          p_action: string
          p_merchant_code: string
          p_pause_until?: string
          p_rule_id: string
        }
        Returns: Json
      }
      fn_manage_referrals: {
        Args: { p_action: string; p_data?: Json; p_merchant_code: string }
        Returns: Json
      }
      fn_mark_platform_push_sent: {
        Args: { p_id: string; p_type: string }
        Returns: Json
      }
      fn_mark_service_done: {
        Args: {
          p_booking_id: string
          p_merchant_code: string
          p_resource_id?: string
        }
        Returns: Json
      }
      fn_merge_customers: {
        Args: {
          p_guest_customer_id: string
          p_merchant_code: string
          p_primary_customer_id: string
        }
        Returns: Json
      }
      fn_notify_schedule_change: {
        Args: {
          p_merchant_code: string
          p_override_date: string
          p_reason?: string
          p_resource_id: string
        }
        Returns: Json
      }
      fn_notify_waitlist_on_cancel: {
        Args: {
          p_merchant_code: string
          p_resource_id: string
          p_service_id: string
          p_start_time: string
        }
        Returns: Json
      }
      fn_onboarding_add_material: {
        Args: {
          p_case_id: string
          p_content?: string
          p_file_name?: string
          p_file_url?: string
          p_line_message_id?: string
          p_message_type: string
          p_metadata?: Json
        }
        Returns: Json
      }
      fn_onboarding_complete_provision: {
        Args: { p_case_number: string; p_merchant_code: string }
        Returns: Json
      }
      fn_onboarding_create_case: {
        Args: {
          p_display_name?: string
          p_line_user_id: string
          p_picture_url?: string
        }
        Returns: Json
      }
      fn_onboarding_get_case: { Args: { p_case_number: string }; Returns: Json }
      fn_onboarding_list_cases: { Args: never; Returns: Json }
      fn_onboarding_mark_ready: { Args: { p_case_id: string }; Returns: Json }
      fn_onboarding_pair_line: {
        Args: {
          p_line_display_name?: string
          p_line_picture_url?: string
          p_line_user_id: string
          p_pairing_code: string
        }
        Returns: Json
      }
      fn_onboarding_register: {
        Args: {
          p_business_name: string
          p_contact_email?: string
          p_contact_name: string
          p_contact_phone?: string
          p_industry?: string
          p_notes?: string
        }
        Returns: Json
      }
      fn_onboarding_save_analysis: {
        Args: {
          p_ai_analysis: Json
          p_case_number: string
          p_provision_input: Json
        }
        Returns: Json
      }
      fn_onboarding_save_draft: {
        Args: {
          p_ai_analysis: Json
          p_case_number: string
          p_provision_input: Json
        }
        Returns: Json
      }
      fn_onboarding_status: { Args: { p_line_user_id: string }; Returns: Json }
      fn_onboarding_update_notes: {
        Args: { p_case_number: string; p_notes: string }
        Returns: Json
      }
      fn_onboarding_update_provision: {
        Args: { p_case_number: string; p_provision_input: Json }
        Returns: Json
      }
      fn_open_shift: {
        Args: { p_merchant_code: string; p_opened_by?: string }
        Returns: Json
      }
      fn_open_support_request: { Args: { p_req: Json }; Returns: string }
      fn_platform_dashboard_stats: { Args: never; Returns: Json }
      fn_platform_monitoring_stats: { Args: never; Returns: Json }
      fn_process_automation_rules: { Args: never; Returns: Json }
      fn_process_payment_callback: {
        Args: {
          p_amount: number
          p_booking_id: string
          p_gateway_trade_no: string
          p_gateway_transaction_id: string
          p_merchant_code: string
          p_metadata?: Json
          p_payment_type?: string
          p_status: string
        }
        Returns: Json
      }
      fn_process_payment_refund: {
        Args: {
          p_merchant_code: string
          p_payment_id: string
          p_reason?: string
          p_refund_amount: number
        }
        Returns: Json
      }
      fn_process_recurring_bookings: { Args: never; Returns: Json }
      fn_process_referral: {
        Args: {
          p_merchant_code: string
          p_referral_code: string
          p_referred_booking_id?: string
          p_referred_customer_id: string
        }
        Returns: Json
      }
      fn_provision_merchant: { Args: { p_input: Json }; Returns: Json }
      fn_provision_notification_templates: {
        Args: { p_merchant_code: string }
        Returns: number
      }
      fn_purchase_package: {
        Args: {
          p_customer_line_user_id: string
          p_gateway_transaction_id?: string
          p_merchant_code: string
          p_package_id: string
        }
        Returns: Json
      }
      fn_redeem_gift_card: {
        Args: {
          p_amount: number
          p_booking_id: string
          p_code: string
          p_merchant_code: string
        }
        Returns: Json
      }
      fn_refund_credit: {
        Args: { p_booking_id: string; p_merchant_code: string }
        Returns: number
      }
      fn_refund_package_session: {
        Args: {
          p_booking_id: string
          p_customer_package_id: string
          p_merchant_code: string
        }
        Returns: Json
      }
      fn_refund_stored_value: {
        Args: { p_booking_id: string; p_merchant_code: string }
        Returns: number
      }
      fn_register_merchant: { Args: { p_input: Json }; Returns: Json }
      fn_reschedule_booking: {
        Args: {
          p_booking_id: string
          p_merchant_code: string
          p_new_start_time: string
          p_reason?: string
          p_rescheduled_by?: string
        }
        Returns: Json
      }
      fn_resolve_feature_value: {
        Args: { p_feature_type: string; p_raw_value: Json }
        Returns: Json
      }
      fn_send_otp: {
        Args: { p_merchant_code: string; p_phone: string; p_purpose?: string }
        Returns: Json
      }
      fn_staff_performance: {
        Args: {
          p_merchant_code: string
          p_period?: string
          p_resource_id: string
        }
        Returns: Json
      }
      fn_submit_review: {
        Args: {
          p_booking_id: string
          p_comment?: string
          p_environment_rating?: number
          p_is_anonymous?: boolean
          p_merchant_code: string
          p_overall_rating: number
          p_service_rating?: number
          p_source?: string
          p_tags?: string[]
        }
        Returns: Json
      }
      fn_update_merchant_setting: {
        Args: { p_merchant_code: string; p_setting_name: string; p_value: Json }
        Returns: Json
      }
      fn_use_credit: {
        Args: {
          p_booking_id: string
          p_customer_id: string
          p_max_amount: number
          p_merchant_code: string
        }
        Returns: number
      }
      fn_use_package_session: {
        Args: {
          p_booking_id: string
          p_customer_package_id: string
          p_merchant_code: string
        }
        Returns: Json
      }
      fn_validate_booking_limits: {
        Args: {
          p_booking_date: string
          p_customer_line_user_id: string
          p_merchant_code: string
        }
        Returns: Json
      }
      fn_validate_discount_code: {
        Args: {
          p_code: string
          p_customer_id?: string
          p_merchant_code: string
          p_order_amount?: number
          p_service_id?: string
        }
        Returns: Json
      }
      fn_verify_guest: {
        Args: {
          p_gender?: string
          p_merchant_code: string
          p_name: string
          p_phone: string
        }
        Returns: Json
      }
      fn_verify_otp: {
        Args: {
          p_merchant_code: string
          p_otp_code: string
          p_phone: string
          p_purpose?: string
        }
        Returns: Json
      }
      get_merchant: { Args: { p_merchant_code: string }; Returns: Json }
      get_platform_merchant: {
        Args: { p_merchant_code: string }
        Returns: Json
      }
      match_knowledge: {
        Args: {
          match_count?: number
          match_threshold?: number
          p_merchant_code?: string
          query_embedding: string
        }
        Returns: {
          answer: string
          category: string
          id: string
          merchant_code: string
          question: string
          similarity: number
        }[]
      }
      update_platform_merchant: {
        Args: { p_data: Json; p_merchant_code: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  platform: {
    Tables: {
      cms_activity_logs: {
        Row: {
          admin_user_id: string | null
          api_duration_ms: number | null
          api_endpoint: string | null
          api_error_message: string | null
          api_method: string | null
          api_status_code: number | null
          created_at: string
          element_id: string | null
          element_text: string | null
          event_category: string | null
          event_type: string
          id: string
          merchant_code: string
          metadata: Json | null
          page_path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          viewport_width: number | null
        }
        Insert: {
          admin_user_id?: string | null
          api_duration_ms?: number | null
          api_endpoint?: string | null
          api_error_message?: string | null
          api_method?: string | null
          api_status_code?: number | null
          created_at?: string
          element_id?: string | null
          element_text?: string | null
          event_category?: string | null
          event_type: string
          id?: string
          merchant_code: string
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          viewport_width?: number | null
        }
        Update: {
          admin_user_id?: string | null
          api_duration_ms?: number | null
          api_endpoint?: string | null
          api_error_message?: string | null
          api_method?: string | null
          api_status_code?: number | null
          created_at?: string
          element_id?: string | null
          element_text?: string | null
          event_category?: string | null
          event_type?: string
          id?: string
          merchant_code?: string
          metadata?: Json | null
          page_path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          viewport_width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_activity_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      daily_digests: {
        Row: {
          alerts: Json | null
          created_at: string | null
          digest_date: string
          id: string
          merchants: Json
          sent_at: string | null
          summary: Json
        }
        Insert: {
          alerts?: Json | null
          created_at?: string | null
          digest_date?: string
          id?: string
          merchants?: Json
          sent_at?: string | null
          summary?: Json
        }
        Update: {
          alerts?: Json | null
          created_at?: string | null
          digest_date?: string
          id?: string
          merchants?: Json
          sent_at?: string | null
          summary?: Json
        }
        Relationships: []
      }
      email_verifications: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          merchant_code: string | null
          metadata: Json | null
          purpose: string
          token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          merchant_code?: string | null
          metadata?: Json | null
          purpose?: string
          token: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          merchant_code?: string | null
          metadata?: Json | null
          purpose?: string
          token?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_email_verifications_merchant"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      feature_definitions: {
        Row: {
          auto_enable_on_plan: string[] | null
          category: string
          conflicts_with: string[] | null
          created_at: string | null
          depends_on: string[] | null
          description: string | null
          display_name: string
          feature_key: string
          feature_type: string
          recommended_for: string[] | null
          related_tables: string[] | null
          settings_key: string | null
          sort_order: number | null
        }
        Insert: {
          auto_enable_on_plan?: string[] | null
          category: string
          conflicts_with?: string[] | null
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          display_name: string
          feature_key: string
          feature_type?: string
          recommended_for?: string[] | null
          related_tables?: string[] | null
          settings_key?: string | null
          sort_order?: number | null
        }
        Update: {
          auto_enable_on_plan?: string[] | null
          category?: string
          conflicts_with?: string[] | null
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          display_name?: string
          feature_key?: string
          feature_type?: string
          recommended_for?: string[] | null
          related_tables?: string[] | null
          settings_key?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      industry_templates: {
        Row: {
          created_at: string | null
          default_ai_persona: Json | null
          default_booking_rules: Json
          default_knowledge: Json | null
          default_knowledge_base: Json | null
          default_merchant_settings: Json | null
          default_schedule: Json
          default_services: Json
          description: string | null
          display_name: string
          industry: string
          is_active: boolean | null
          killer_features: string[] | null
          onboarding_questions: Json | null
          setup_completeness: number | null
          sort_order: number | null
          sub_industries: Json | null
          suggested_features: Json | null
          suggested_theme: Json | null
          terminology: Json
        }
        Insert: {
          created_at?: string | null
          default_ai_persona?: Json | null
          default_booking_rules?: Json
          default_knowledge?: Json | null
          default_knowledge_base?: Json | null
          default_merchant_settings?: Json | null
          default_schedule?: Json
          default_services?: Json
          description?: string | null
          display_name: string
          industry: string
          is_active?: boolean | null
          killer_features?: string[] | null
          onboarding_questions?: Json | null
          setup_completeness?: number | null
          sort_order?: number | null
          sub_industries?: Json | null
          suggested_features?: Json | null
          suggested_theme?: Json | null
          terminology?: Json
        }
        Update: {
          created_at?: string | null
          default_ai_persona?: Json | null
          default_booking_rules?: Json
          default_knowledge?: Json | null
          default_knowledge_base?: Json | null
          default_merchant_settings?: Json | null
          default_schedule?: Json
          default_services?: Json
          description?: string | null
          display_name?: string
          industry?: string
          is_active?: boolean | null
          killer_features?: string[] | null
          onboarding_questions?: Json | null
          setup_completeness?: number | null
          sort_order?: number | null
          sub_industries?: Json | null
          suggested_features?: Json | null
          suggested_theme?: Json | null
          terminology?: Json
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          merchant_code: string
          notes: string | null
          overage_charges: Json | null
          paid_at: string | null
          payment_method: string | null
          payment_reference: string | null
          period_end: string
          period_start: string
          plan_amount: number
          sent_at: string | null
          status: string
          subscription_id: string | null
          tax_amount: number | null
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number: string
          merchant_code: string
          notes?: string | null
          overage_charges?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          period_end: string
          period_start: string
          plan_amount?: number
          sent_at?: string | null
          status?: string
          subscription_id?: string | null
          tax_amount?: number | null
          total?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          merchant_code?: string
          notes?: string | null
          overage_charges?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          period_end?: string
          period_start?: string
          plan_amount?: number
          sent_at?: string | null
          status?: string
          subscription_id?: string | null
          tax_amount?: number | null
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "merchant_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      merchant_health_logs: {
        Row: {
          created_at: string | null
          factors: Json
          health_score: number
          id: string
          log_date: string
          merchant_code: string
          recommendations: Json | null
          trend: string | null
        }
        Insert: {
          created_at?: string | null
          factors?: Json
          health_score: number
          id?: string
          log_date?: string
          merchant_code: string
          recommendations?: Json | null
          trend?: string | null
        }
        Update: {
          created_at?: string | null
          factors?: Json
          health_score?: number
          id?: string
          log_date?: string
          merchant_code?: string
          recommendations?: Json | null
          trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_health_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      merchant_subscriptions: {
        Row: {
          billing_cycle: string | null
          cancelled_at: string | null
          complimentary_until: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          feature_overrides: Json | null
          id: string
          is_founding_merchant: boolean
          last_payment_at: string | null
          merchant_code: string
          next_payment_at: string | null
          payment_method: string | null
          plan_id: string
          status: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          cancelled_at?: string | null
          complimentary_until?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          feature_overrides?: Json | null
          id?: string
          is_founding_merchant?: boolean
          last_payment_at?: string | null
          merchant_code: string
          next_payment_at?: string | null
          payment_method?: string | null
          plan_id: string
          status?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          cancelled_at?: string | null
          complimentary_until?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          feature_overrides?: Json | null
          id?: string
          is_founding_merchant?: boolean
          last_payment_at?: string | null
          merchant_code?: string
          next_payment_at?: string | null
          payment_method?: string | null
          plan_id?: string
          status?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merchant_subscriptions_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
          {
            foreignKeyName: "merchant_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          address: string | null
          created_at: string | null
          display_name: string
          email: string | null
          features: Json | null
          google_map_url: string | null
          industry: string
          line_channel_access_token: string | null
          line_channel_id: string | null
          line_channel_secret: string | null
          line_liff_id: string | null
          line_login_channel_id: string | null
          line_login_channel_secret: string | null
          line_oa_url: string | null
          logo_url: string | null
          merchant_code: string
          metadata: Json | null
          onboarded_at: string | null
          onboarded_by: string | null
          phone: string | null
          plan: string | null
          setup_completed_at: string | null
          setup_step: string | null
          status: string | null
          suspended_at: string | null
          suspended_reason: string | null
          timezone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          display_name: string
          email?: string | null
          features?: Json | null
          google_map_url?: string | null
          industry?: string
          line_channel_access_token?: string | null
          line_channel_id?: string | null
          line_channel_secret?: string | null
          line_liff_id?: string | null
          line_login_channel_id?: string | null
          line_login_channel_secret?: string | null
          line_oa_url?: string | null
          logo_url?: string | null
          merchant_code: string
          metadata?: Json | null
          onboarded_at?: string | null
          onboarded_by?: string | null
          phone?: string | null
          plan?: string | null
          setup_completed_at?: string | null
          setup_step?: string | null
          status?: string | null
          suspended_at?: string | null
          suspended_reason?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          display_name?: string
          email?: string | null
          features?: Json | null
          google_map_url?: string | null
          industry?: string
          line_channel_access_token?: string | null
          line_channel_id?: string | null
          line_channel_secret?: string | null
          line_liff_id?: string | null
          line_login_channel_id?: string | null
          line_login_channel_secret?: string | null
          line_oa_url?: string | null
          logo_url?: string | null
          merchant_code?: string
          metadata?: Json | null
          onboarded_at?: string | null
          onboarded_by?: string | null
          phone?: string | null
          plan?: string | null
          setup_completed_at?: string | null
          setup_step?: string | null
          status?: string | null
          suspended_at?: string | null
          suspended_reason?: string | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      onboarding_cases: {
        Row: {
          ai_analysis: Json | null
          assigned_to: string | null
          business_name: string | null
          case_number: string
          confirmation_sent_at: string | null
          confirmed_at: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          design_choice: string | null
          feature_gaps: Json | null
          id: string
          industry: string | null
          line_display_name: string | null
          line_picture_url: string | null
          line_user_id: string | null
          merchant_code: string | null
          monthly_fee: number | null
          notes: string | null
          paired_at: string | null
          pairing_code: string | null
          pairing_code_expires: string | null
          plan_code: string | null
          provision_input: Json | null
          provisioned_at: string | null
          ready_at: string | null
          registration_source: string | null
          status: string
          training_completed_at: string | null
          updated_at: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          assigned_to?: string | null
          business_name?: string | null
          case_number: string
          confirmation_sent_at?: string | null
          confirmed_at?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          design_choice?: string | null
          feature_gaps?: Json | null
          id?: string
          industry?: string | null
          line_display_name?: string | null
          line_picture_url?: string | null
          line_user_id?: string | null
          merchant_code?: string | null
          monthly_fee?: number | null
          notes?: string | null
          paired_at?: string | null
          pairing_code?: string | null
          pairing_code_expires?: string | null
          plan_code?: string | null
          provision_input?: Json | null
          provisioned_at?: string | null
          ready_at?: string | null
          registration_source?: string | null
          status?: string
          training_completed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          assigned_to?: string | null
          business_name?: string | null
          case_number?: string
          confirmation_sent_at?: string | null
          confirmed_at?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          design_choice?: string | null
          feature_gaps?: Json | null
          id?: string
          industry?: string | null
          line_display_name?: string | null
          line_picture_url?: string | null
          line_user_id?: string | null
          merchant_code?: string | null
          monthly_fee?: number | null
          notes?: string | null
          paired_at?: string | null
          pairing_code?: string | null
          pairing_code_expires?: string | null
          plan_code?: string | null
          provision_input?: Json | null
          provisioned_at?: string | null
          ready_at?: string | null
          registration_source?: string | null
          status?: string
          training_completed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_cases_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      onboarding_materials: {
        Row: {
          ai_category: string | null
          ai_extracted: Json | null
          case_id: string
          content: string | null
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          line_message_id: string | null
          message_type: string
          metadata: Json | null
        }
        Insert: {
          ai_category?: string | null
          ai_extracted?: Json | null
          case_id: string
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          line_message_id?: string | null
          message_type: string
          metadata?: Json | null
        }
        Update: {
          ai_category?: string | null
          ai_extracted?: Json | null
          case_id?: string
          content?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          line_message_id?: string | null
          message_type?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_materials_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "onboarding_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_admins: {
        Row: {
          created_at: string | null
          display_name: string
          email: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          mfa_enabled: boolean | null
          mfa_secret: string | null
          password_hash: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          email: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          password_hash: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          email?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          password_hash?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          context: Json | null
          created_at: string | null
          description: string | null
          id: string
          merchant_code: string | null
          resolved_at: string | null
          sent_at: string | null
          severity: string
          status: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type: string
          context?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          merchant_code?: string | null
          resolved_at?: string | null
          sent_at?: string | null
          severity: string
          status?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          context?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          merchant_code?: string | null
          resolved_at?: string | null
          sent_at?: string | null
          severity?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_alerts_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      platform_events: {
        Row: {
          actor_id: string | null
          actor_type: string
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          merchant_code: string | null
          user_agent: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_type?: string
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          merchant_code?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_type?: string
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          merchant_code?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_events_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      session_docs: {
        Row: {
          content: string
          created_at: string | null
          doc_type: string
          id: string
          session_date: string
          stats: Json | null
          summary: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          doc_type: string
          id?: string
          session_date: string
          stats?: Json | null
          summary?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          doc_type?: string
          id?: string
          session_date?: string
          stats?: Json | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          annual_price: number | null
          created_at: string | null
          description: string | null
          display_name: string
          features: Json
          id: string
          is_active: boolean | null
          monthly_price: number
          plan_code: string
          sort_order: number | null
          trial_days: number | null
        }
        Insert: {
          annual_price?: number | null
          created_at?: string | null
          description?: string | null
          display_name: string
          features?: Json
          id?: string
          is_active?: boolean | null
          monthly_price?: number
          plan_code: string
          sort_order?: number | null
          trial_days?: number | null
        }
        Update: {
          annual_price?: number | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          features?: Json
          id?: string
          is_active?: boolean | null
          monthly_price?: number
          plan_code?: string
          sort_order?: number | null
          trial_days?: number | null
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          admin_user_id: string | null
          created_at: string
          id: string
          merchant_code: string
          metadata: Json | null
          previous_pages: Json | null
          problem_category: string
          problem_description: string | null
          recent_api_errors: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          session_id: string | null
          status: string | null
          triggered_from_page: string | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          merchant_code: string
          metadata?: Json | null
          previous_pages?: Json | null
          problem_category: string
          problem_description?: string | null
          recent_api_errors?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          session_id?: string | null
          status?: string | null
          triggered_from_page?: string | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          merchant_code?: string
          metadata?: Json | null
          previous_pages?: Json | null
          problem_category?: string
          problem_description?: string | null
          recent_api_errors?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          session_id?: string | null
          status?: string | null
          triggered_from_page?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      ui_errors: {
        Row: {
          admin_user_id: string | null
          api_endpoint: string | null
          api_method: string | null
          api_status_code: number | null
          app_version: string | null
          component_name: string | null
          created_at: string
          customer_id: string | null
          error_message: string
          error_stack: string | null
          error_type: string
          fingerprint: string
          first_occurred_at: string
          id: string
          last_occurred_at: string
          merchant_code: string | null
          metadata: Json | null
          occurrence_count: number | null
          page_path: string | null
          resolved: boolean | null
          resolved_at: string | null
          session_id: string | null
          severity: string | null
          source: string
        }
        Insert: {
          admin_user_id?: string | null
          api_endpoint?: string | null
          api_method?: string | null
          api_status_code?: number | null
          app_version?: string | null
          component_name?: string | null
          created_at?: string
          customer_id?: string | null
          error_message: string
          error_stack?: string | null
          error_type: string
          fingerprint: string
          first_occurred_at?: string
          id?: string
          last_occurred_at?: string
          merchant_code?: string | null
          metadata?: Json | null
          occurrence_count?: number | null
          page_path?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          session_id?: string | null
          severity?: string | null
          source: string
        }
        Update: {
          admin_user_id?: string | null
          api_endpoint?: string | null
          api_method?: string | null
          api_status_code?: number | null
          app_version?: string | null
          component_name?: string | null
          created_at?: string
          customer_id?: string | null
          error_message?: string
          error_stack?: string | null
          error_type?: string
          fingerprint?: string
          first_occurred_at?: string
          id?: string
          last_occurred_at?: string
          merchant_code?: string | null
          metadata?: Json | null
          occurrence_count?: number | null
          page_path?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          session_id?: string | null
          severity?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "ui_errors_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      usage_logs: {
        Row: {
          ai_limit: number | null
          ai_messages_count: number | null
          ai_tokens_used: number | null
          api_calls: number | null
          bookings_count: number | null
          bookings_limit: number | null
          created_at: string | null
          customers_count: number | null
          id: string
          is_over_limit: boolean | null
          merchant_code: string
          notifications_sent: number | null
          over_limit_notified: boolean | null
          period_month: string
          storage_bytes: number | null
          updated_at: string | null
        }
        Insert: {
          ai_limit?: number | null
          ai_messages_count?: number | null
          ai_tokens_used?: number | null
          api_calls?: number | null
          bookings_count?: number | null
          bookings_limit?: number | null
          created_at?: string | null
          customers_count?: number | null
          id?: string
          is_over_limit?: boolean | null
          merchant_code: string
          notifications_sent?: number | null
          over_limit_notified?: boolean | null
          period_month: string
          storage_bytes?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_limit?: number | null
          ai_messages_count?: number | null
          ai_tokens_used?: number | null
          api_calls?: number | null
          bookings_count?: number | null
          bookings_limit?: number | null
          created_at?: string | null
          customers_count?: number | null
          id?: string
          is_over_limit?: boolean | null
          merchant_code?: string
          notifications_sent?: number | null
          over_limit_notified?: boolean | null
          period_month?: string
          storage_bytes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
      user_sessions: {
        Row: {
          admin_user_id: string | null
          created_at: string
          customer_id: string | null
          duration_sec: number | null
          ended_at: string | null
          id: string
          merchant_code: string | null
          page_count: number | null
          source: string
          started_at: string
          user_agent: string | null
          viewport_width: number | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          customer_id?: string | null
          duration_sec?: number | null
          ended_at?: string | null
          id?: string
          merchant_code?: string | null
          page_count?: number | null
          source: string
          started_at?: string
          user_agent?: string | null
          viewport_width?: number | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          customer_id?: string | null
          duration_sec?: number | null
          ended_at?: string | null
          id?: string
          merchant_code?: string | null
          page_count?: number | null
          source?: string
          started_at?: string
          user_agent?: string | null
          viewport_width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_merchant_code_fkey"
            columns: ["merchant_code"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["merchant_code"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fn_auto_governance: { Args: never; Returns: Json }
      fn_calculate_merchant_health_score: {
        Args: { p_merchant_code: string }
        Returns: Json
      }
      fn_change_subscription: {
        Args: {
          p_merchant_code: string
          p_new_plan_code: string
          p_payment_method?: string
        }
        Returns: Json
      }
      fn_check_smart_alerts: { Args: never; Returns: Json }
      fn_check_usage_limit: {
        Args: { p_merchant_code: string; p_resource: string }
        Returns: Json
      }
      fn_generate_case_number: { Args: never; Returns: string }
      fn_generate_daily_digest: { Args: never; Returns: Json }
      fn_generate_merchant_code: {
        Args: { p_display_name: string }
        Returns: string
      }
      fn_generate_monthly_invoices: { Args: never; Returns: Json }
      fn_increment_usage: {
        Args: { p_field: string; p_increment?: number; p_merchant_code: string }
        Returns: undefined
      }
      fn_log_platform_event: {
        Args: {
          p_actor_id?: string
          p_actor_type?: string
          p_event_data?: Json
          p_event_type: string
          p_merchant_code: string
        }
        Returns: string
      }
      fn_teardown_merchant: { Args: { p_merchant_code: string }; Returns: Json }
      fn_update_setup_step: {
        Args: { p_merchant_code: string; p_step: string }
        Returns: Json
      }
      fn_validate_feature_overrides: {
        Args: { p_overrides: Json }
        Returns: boolean
      }
      fn_validate_plan_features: {
        Args: { p_features: Json }
        Returns: boolean
      }
      fn_weekly_observability_digest: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string | null
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          session_token: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          auth_user_id: string | null
          binding_code: string | null
          binding_code_expires: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          email_verified: boolean | null
          email_verified_at: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          line_user_id: string | null
          menu_mode: string | null
          merchant_code: string
          password_hash: string | null
          password_must_change: boolean | null
          resource_id: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          binding_code?: string | null
          binding_code_expires?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          line_user_id?: string | null
          menu_mode?: string | null
          merchant_code: string
          password_hash?: string | null
          password_must_change?: boolean | null
          resource_id?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          binding_code?: string | null
          binding_code_expires?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          email_verified?: boolean | null
          email_verified_at?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          line_user_id?: string | null
          menu_mode?: string | null
          merchant_code?: string
          password_hash?: string | null
          password_must_change?: boolean | null
          resource_id?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json | null
          created_at: string | null
          error_message: string | null
          error_stack: string | null
          error_type: string | null
          id: string
          line_user_id: string | null
          merchant_code: string
          severity: string
          source_function: string | null
          source_module: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          error_message?: string | null
          error_stack?: string | null
          error_type?: string | null
          id?: string
          line_user_id?: string | null
          merchant_code: string
          severity?: string
          source_function?: string | null
          source_module?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          error_message?: string | null
          error_stack?: string | null
          error_type?: string | null
          id?: string
          line_user_id?: string | null
          merchant_code?: string
          severity?: string
          source_function?: string | null
          source_module?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      merchant_settings: {
        Row: {
          ai_settings: Json | null
          booking_rules: Json | null
          business_hours: Json | null
          created_at: string | null
          display_settings: Json | null
          health_form_settings: Json | null
          loyalty_settings: Json | null
          merchant_code: string | null
          metadata: Json | null
          notification_settings: Json | null
          payment_settings: Json | null
          pricing_rules: Json | null
          rich_menu_config: Json | null
          stored_value_settings: Json | null
          updated_at: string | null
        }
        Insert: {
          ai_settings?: Json | null
          booking_rules?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          display_settings?: Json | null
          health_form_settings?: Json | null
          loyalty_settings?: Json | null
          merchant_code?: string | null
          metadata?: Json | null
          notification_settings?: Json | null
          payment_settings?: Json | null
          pricing_rules?: Json | null
          rich_menu_config?: Json | null
          stored_value_settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          ai_settings?: Json | null
          booking_rules?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          display_settings?: Json | null
          health_form_settings?: Json | null
          loyalty_settings?: Json | null
          merchant_code?: string | null
          metadata?: Json | null
          notification_settings?: Json | null
          payment_settings?: Json | null
          pricing_rules?: Json | null
          rich_menu_config?: Json | null
          stored_value_settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_platform_merchant: {
        Args: { p_merchant_code: string }
        Returns: Json
      }
      update_platform_merchant: {
        Args: { p_data: Json; p_merchant_code: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  booking: {
    Enums: {},
  },
  platform: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
